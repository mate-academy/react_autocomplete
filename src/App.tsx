import debounce from 'lodash.debounce';
import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC<{ delay?: number }> = ({ delay = 300 }) => {
  const [query, setQuery] = useState('');
  const [applyQuery, setApplyQuery] = useState('');
  const [filterPeople, setFilterPeople] = useState<Person[]>(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>();

  const applyDebounce = useRef<(value: string) => void>();

  useEffect(() => {
    applyDebounce.current = debounce((value: string) => {
      setApplyQuery(value);
    }, delay);

    return () => {
      applyDebounce.current?.cancel();
    };
  }, [delay]);

  useEffect(() => {
    if (applyQuery.trim() === '') {
      setFilterPeople(peopleFromServer);
    } else {
      setFilterPeople(
        peopleFromServer.filter(personFromServer =>
          personFromServer.name
            .toLowerCase()
            .includes(applyQuery.toLowerCase()),
        ),
      );
    }
  }, [applyQuery]);

  const handlePerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setFilterPeople([]);
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
              onChange={e => {
                const value = e.target.value;

                setQuery(value);
                applyDebounce.current?.(value);
              }}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filterPeople.length > 0 ? (
                filterPeople.map((filterPerson, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handlePerson(filterPerson)}
                  >
                    <p className="has-text-link">{filterPerson.name}</p>
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
