import React, { useCallback, useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const filteredQuery = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    debounce((query: string) => {
      const trimmedQuery = query.trim();

      if (trimmedQuery === '') {
        setAppliedQuery(peopleFromServer);
      } else {
        const filtered = peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(trimmedQuery.toLowerCase()),
        );

        setAppliedQuery(filtered);
      }
    }, 300),
    [],
  );

  useEffect(() => {
    if (query !== selectedPerson?.name) {
      filteredQuery(query);
    }
  }, [query, selectedPerson, filteredQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);

    if (selectedPerson && newQuery !== selectedPerson.name) {
      setSelectedPerson(null);
    }
  };

  const handleAppliedClick = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setIsDropdownActive(false);
  };

  const handleInputFocus = () => {
    setIsDropdownActive(true);
    if (query === '') {
      setAppliedQuery(peopleFromServer);
    }
  };

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
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>

          {isDropdownActive && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {appliedQuery.length > 0 ? (
                  appliedQuery.map(person => (
                    <div
                      key={person.slug}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      onClick={() => handleAppliedClick(person)}
                    >
                      <p
                        className={
                          person.sex === 'f'
                            ? 'has-text-danger'
                            : 'has-text-link'
                        }
                      >
                        {person.name}
                      </p>
                    </div>
                  ))
                ) : (
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
