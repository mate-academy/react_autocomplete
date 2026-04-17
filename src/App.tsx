import './App.scss';
import { Person } from './types/Person';
import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';

type Props = {
  persons: Person[];
  delay?: number;
  onSelected?: (person: Person) => void;
};

export const App: React.FC<Props> = ({ persons, delay = 300, onSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  React.useEffect(() => {
    return () => {
      applyQuery.cancel?.();
    };
  }, [applyQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    setSelectedPerson(null);

    const trimmed = value.trim();

    if (!trimmed) {
      setAppliedQuery('');

      return;
    }

    if (trimmed === appliedQuery) {
      return;
    }

    applyQuery(trimmed);
  };

  const filteredPeople = persons.filter(person =>
    person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase()),
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          {isFocused && filteredPeople.length > 0 && (
            <div
              className="dropdown-menu is-active"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    key={person.name}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onMouseDown={() => {
                      setSelectedPerson(person);
                      setQuery(person.name);
                      setAppliedQuery(person.name);
                      setIsFocused(false);
                      onSelected?.(person);
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {appliedQuery && filteredPeople.length === 0 && (
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
      </main>
    </div>
  );
};
