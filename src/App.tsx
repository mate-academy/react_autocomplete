import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const delay = 300;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query]);

  const visiblePeople = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    if (normalizedQuery === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [debouncedQuery]);

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newQuery = event.target.value;

    setQuery(newQuery);
    setIsOpen(true);

    if (selectedPerson) {
      setSelectedPerson(null);
    }
  };

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setDebouncedQuery(person.name);
    setIsOpen(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => {
                setIsOpen(true);
              }}
            />
          </div>

          {isOpen && visiblePeople.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {visiblePeople.map(person => (
                  <div
                    key={person.id}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => {
                      handlePersonSelect(person);
                    }}
                  >
                    <p
                      className={
                        person.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isOpen && visiblePeople.length === 0 && (
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
            <p className="has-text-danger">
              No matching suggestions
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
