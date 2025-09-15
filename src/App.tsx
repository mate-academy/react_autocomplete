import React, { useState, useRef, useMemo, useEffect, FocusEvent } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';
import 'bulma/css/bulma.min.css';

type Props = {
  delay?: number; // опционально
  onSelected?: (person: Person) => void;
};

export const App: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [filteredPeople, setFilteredPeople] =
    useState<Person[]>(peopleFromServer);

  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState(false);

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [inputValue, setInputValue] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const lastQueryRef = useRef('');

  const handleShowList = useMemo(
    () =>
      debounce((query: string) => {
        const normalized = query.trim().toLowerCase();

        const results = peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(normalized),
        );

        setFilteredPeople(results);

        if (query && results.length === 0) {
          setError(true);
        } else {
          setError(false);
        }

        if (!query) {
          setFilteredPeople(peopleFromServer);
        }

        lastQueryRef.current = normalized;
      }, delay),
    [delay],
  );

  useEffect(() => {
    return () => {
      handleShowList.cancel();
    };
  }, [handleShowList]);

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setInputValue(person.name);
    setIsFocused(false);
    onSelected?.(person);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const normalized = raw.trim();

    setInputValue(raw);

    if (normalized === '') {
      setFilteredPeople(peopleFromServer);
      setError(false);
      setIsFocused(true);

      return;
    }

    if (normalized !== lastQueryRef.current) {
      handleShowList(normalized);
    }

    setSelectedPerson(null);
    setIsFocused(true);
  };

  const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    const related = event.relatedTarget as HTMLElement | null;

    if (related && dropdownRef.current?.contains(related)) {
      return;
    }

    setIsFocused(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-qa="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          ref={dropdownRef}
          className={`dropdown ${
            isFocused && (filteredPeople.length > 0 || error) ? 'is-active' : ''
          }`}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              value={inputValue}
              placeholder="Enter a part of the name"
              className="input"
              data-qa="search-input"
              data-cy="search-input"
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={handleInputBlur}
            />
          </div>

          <div
            className="dropdown-menu"
            role="menu"
            data-qa="suggestions-list"
            data-cy="suggestions-list"
          >
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <a
                  key={person.slug}
                  className="dropdown-item"
                  data-qa="suggestion-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(person)}
                  tabIndex={0}
                >
                  {person.name}
                </a>
              ))}

              {error && (
                <div
                  className="dropdown-item has-text-danger is-unselectable"
                  role="alert"
                  data-qa="no-suggestions-message"
                  data-cy="no-suggestions-message"
                >
                  No matching suggestions
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
