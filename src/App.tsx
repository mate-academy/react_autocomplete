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
import cn from 'classnames';

type Props = {
  debounceDelay?: number;
  onSelected?: (person: Person) => void;
};

export const App: React.FC<Props> = ({ debounceDelay = 300, onSelected }) => {
  const [selectedItem, setSelectedItem] = useState<Person | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const lastAppliedValueRef = useRef<string>('');

  const filteredPeople = useMemo(() => {
    const trimmed = appliedQuery.trim();

    if (isInputFocused && trimmed === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(trimmed.toLowerCase()),
    );
  }, [appliedQuery, isInputFocused]);

  const debouncedApply = useMemo(() => {
    return debounce((value: string) => {
      if (lastAppliedValueRef.current !== value) {
        setAppliedQuery(value);
        lastAppliedValueRef.current = value;
      }
    }, debounceDelay);
  }, [debounceDelay]);

  useEffect(() => {
    return () => {
      debouncedApply.cancel();
    };
  }, [debouncedApply]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    const trimmed = next.trim();

    setQuery(next);

    if (selectedItem && selectedItem.name.trim() !== trimmed) {
      setSelectedItem(null);
    }

    if (trimmed === '') {
      setAppliedQuery('');
      setIsDropdownOpen(isInputFocused);

      return;
    }

    debouncedApply(next);
    setIsDropdownOpen(true);
  };

  const handleFocus = () => {
    setIsInputFocused(true);
    setIsDropdownOpen(true);
    if (query.trim() === '') {
      setAppliedQuery('');
    }
  };

  const handleBlur = () => {
    setIsInputFocused(false);
    setIsDropdownOpen(false);
  };

  const handlePersonSelected = useCallback(
    (person: Person) => {
      setSelectedItem(person);
      setQuery(person.name);
      setAppliedQuery(person.name);
      setIsInputFocused(false);
      setIsDropdownOpen(false);
      if (typeof onSelected === 'function') {
        onSelected(person);
      }
    },
    [onSelected],
  );

  const isOpen = isInputFocused && isDropdownOpen;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedItem ? (
          <h1 className="title" data-qa="title">
            {`${selectedItem.name} (${selectedItem.born} - ${selectedItem.died})`}
          </h1>
        ) : (
          <h1 className="title" data-qa="title">
            No selected person
          </h1>
        )}

        <div className={cn('dropdown', { 'is-active': isOpen })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-qa="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-qa="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.length > 0 &&
                isOpen &&
                filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-qa="suggestion-item"
                    key={person.id ?? person.slug}
                  >
                    <p
                      className="has-text-link"
                      onMouseDown={() => handlePersonSelected(person)}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              {isOpen && filteredPeople.length === 0 && (
                <div
                  className="dropdown-item"
                  data-qa="no-suggestions-message"
                  role="alert"
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
