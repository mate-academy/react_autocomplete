import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);

    setSelectedPerson(null);
    setIsDropdownOpen(true);
  };

  const normalizedAppliedQuery = appliedQuery.trim().toLowerCase();

  const filteredPeoples = useMemo(() => {
    if (!normalizedAppliedQuery) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(people =>
      people.name.toLowerCase().includes(normalizedAppliedQuery),
    );
  }, [normalizedAppliedQuery]);

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
              onChange={handleQueryChange}
              value={query}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={() => setIsDropdownOpen(false)}
            />
          </div>

          {isDropdownOpen && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeoples.length > 0 ? (
                  filteredPeoples.map(people => (
                    <div
                      key={people.slug}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      onMouseDown={() => {
                        setSelectedPerson(people);
                        setQuery(people.name);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <p
                        className={`${people.sex === 'm' ? 'has-text-link' : 'has-text-danger'}`}
                      >
                        {people.name}
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
