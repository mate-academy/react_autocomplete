import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

interface Props {
  delay?: number;
  onSelected?: (person: Person | null) => void;
}

export const App: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const previousQuery = useRef<string>('');
  const titleField = useRef<HTMLInputElement>(null);

  const applyQuery = useCallback(
    debounce((value: string) => {
      if (value !== previousQuery.current) {
        setAppliedQuery(value);
        previousQuery.current = value;
      }
    }, delay),
    [delay],
  );

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  const filteredPeople = useMemo(() => {
    if (!appliedQuery) {
      return isFocused ? peopleFromServer : [];
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, isFocused]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    applyQuery(value);

    if (selectedPerson) {
      setSelectedPerson(null);
      onSelected?.(null);
    }
  };

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    onSelected?.(person);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  useEffect(() => {
    return () => {
      applyQuery.cancel();
    };
  }, [applyQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              ref={titleField}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div className="dropdown-menu" role="menu">
            {isFocused && !appliedQuery && (
              <div className="dropdown-content" data-cy="suggestions-list">
                {filteredPeople.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    onClick={() => handleSuggestionClick(person)}
                    data-cy="suggestion-item"
                    style={{ cursor: 'pointer' }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {filteredPeople.length === 0 && query && (
            <div
              className="
                notification
                is-danger
                is-light
                mt-3
                is-align-self-flex-start
              "
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
