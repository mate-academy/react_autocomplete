import React, { useCallback, useState, useMemo, useEffect } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';

import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

interface AppProps {
  debounceDelay?: number;
  onSelectPerson?: (person: Person) => void;
}

export const App: React.FC<AppProps> = ({
  debounceDelay = 300,
  onSelectPerson,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const applyQuery = useMemo(
    () => debounce((value: string) => setAppliedQuery(value), debounceDelay),
    [debounceDelay],
  );

  useEffect(() => {
    return () => {
      applyQuery.cancel();
    };
  }, [applyQuery]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
  };

  const filteredPeople = useMemo(() => {
    if (appliedQuery === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson !== null
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onChange={handleInput}
              onFocus={() => setIsDropdownOpen(true)}
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => {
                    setQuery(person.name);
                    setSelectedPerson(person);
                    setIsDropdownOpen(false);
                    onSelectPerson?.(person);
                  }}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredPeople.length === 0 && (
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
