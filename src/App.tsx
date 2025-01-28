import React, { useRef, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';

interface Person {
  id: number;
  name: string;
  born: number;
  died: number;
}

export const App: React.FC<{ delay?: number }> = ({ delay = 300 }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const debouncedApplyQuery = useRef<(value: string) => void>();

  // Оновлюємо debounce при зміні `delay`
  useEffect(() => {
    debouncedApplyQuery.current = debounce((value: string) => {
      setAppliedQuery(value);
    }, delay);

    return () => {
      debouncedApplyQuery.current?.cancel(); // Очищаємо debounce при зміні delay
    };
  }, [delay]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    debouncedApplyQuery.current?.(event.target.value);
  };

  useEffect(() => {
    if (appliedQuery.trim() === '') {
      setFilteredPeople(peopleFromServer);
    } else {
      setFilteredPeople(
        peopleFromServer.filter(person =>
          person.name.toLocaleLowerCase().includes(appliedQuery.toLowerCase()),
        ),
      );
    }
  }, [appliedQuery]);

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setFilteredPeople([]);
  };

  useEffect(() => {
    if (selectedPerson && query !== selectedPerson.name) {
      setSelectedPerson(null);
    }
  }, [query, selectedPerson]);

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
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.length > 0 ? (
                filteredPeople.map(person => (
                  <div
                    key={person.id}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleSelectPerson(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))
              ) : (
                <div
                  className="dropdown-item"
                  data-cy="no-suggestions-message"
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
