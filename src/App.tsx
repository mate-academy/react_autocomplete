import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

type Props = {
  delay?: number;
};

export const App: React.FC<Props> = ({ delay = 300 }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const lastAppliedRef = useRef('');
  const debouncedApplyQuery = useRef<ReturnType<typeof debounce>>();

  // Initialize debounce
  useEffect(() => {
    debouncedApplyQuery.current = debounce((raw: string) => {
      const normalized = raw.toLowerCase().trim();

      // Skip redundant updates
      if (normalized === lastAppliedRef.current) {
        return;
      }

      lastAppliedRef.current = normalized;
      setAppliedQuery(normalized);
    }, delay);

    return () => {
      debouncedApplyQuery.current?.cancel();
    };
  }, [delay]);

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const trimmed = value.trim();

      // Skip filtering if only spaces
      if (value.length > 0 && trimmed === '') {
        setQuery(value);

        return;
      }

      setQuery(value);
      setSelectedUser(null);
      debouncedApplyQuery.current?.(value);
    },
    [],
  );

  const handleFocus = useCallback(() => {
    setIsOpen(true);
    if (query.trim() === '') {
      setAppliedQuery('');
      lastAppliedRef.current = '';
    }
  }, [query]);

  const handleSelect = useCallback((person: Person) => {
    setQuery(person.name);
    setSelectedUser(person);
    setIsOpen(false);
    setAppliedQuery('');
    lastAppliedRef.current = '';
  }, []);

  const filteredUsers = useMemo(() => {
    if (appliedQuery === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter(user =>
      user.name.toLowerCase().includes(appliedQuery),
    );
  }, [appliedQuery]);

  const showNoSuggestions =
    isOpen && appliedQuery !== '' && filteredUsers.length === 0;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedUser
            ? `${selectedUser.name} (${selectedUser.born} - ${selectedUser.died})`
            : 'No selected person'}
        </h1>

        <div
          className={`dropdown ${isOpen ? 'is-active' : ''}`}
          data-qa="autocomplete"
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={handleFocus}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredUsers.map(user => (
                <div
                  key={user.name}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(user)}
                >
                  <p
                    className={
                      user.sex === 'f' ? 'has-text-danger' : 'has-text-link'
                    }
                  >
                    {user.name}
                  </p>
                </div>
              ))}

              {showNoSuggestions && (
                <div
                  className={`
                    notification is-danger is-light
                    mt-3 is-align-self-flex-start
                  `}
                  role="alert"
                  data-cy="no-suggestions-message"
                >
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
