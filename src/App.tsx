import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredPeople = useMemo(() => {
    const normalizedQuery = debounceQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [debounceQuery]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebounceQuery(query);
    }, 300);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [query]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : `No selected person`}
        </h1>

        <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              value={query}
              className="input"
              data-cy="search-input"
              onChange={inputEvent => {
                setQuery(inputEvent.target.value);
                setSelectedPerson(null);
              }}
              onFocus={() => setIsDropdownOpen(true)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(personItem => (
                <div
                  key={personItem.name}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => {
                    setQuery(personItem.name);
                    setSelectedPerson(personItem);
                    setIsDropdownOpen(false);
                  }}
                >
                  <p
                    className={
                      personItem.sex === 'f'
                        ? 'has-text-danger'
                        : 'has-text-link'
                    }
                  >
                    {personItem.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {debounceQuery && filteredPeople.length === 0 && (
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
