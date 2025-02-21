/* eslint-disable @typescript-eslint/no-shadow */
import { useMemo, useState, useEffect } from 'react';
import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

interface AppProps {
  debounceDelay?: number;
}

export const App: React.FC<AppProps> = ({ debounceDelay = 300 }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<null | Person>(null);

  const applyQuery = useMemo(
    () => debounce(setAppliedQuery, debounceDelay),
    [debounceDelay],
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
    setSelectedPerson(null);
  };

  const filterPeople = (query: string, people: Person[]) => {
    if (query.trim() === '') {
      return people;
    }

    return people.filter(person => {
      const nameLower = person.name.toLowerCase().trim();
      const queryLower = appliedQuery.toLowerCase().trim();

      return nameLower.includes(queryLower);
    });
  };

  const peopleToShow = filterPeople(query, peopleFromServer);

  const showNoSuggestionsMessage = query && peopleToShow.length === 0;

  useEffect(() => {
    if (query.trim() === '') {
      setAppliedQuery('');
    }
  }, [query]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson !== null &&
            `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          {selectedPerson === null && `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInput}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {peopleToShow.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => {
                    setSelectedPerson(person);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showNoSuggestionsMessage && (
          <div
            className="notification
            is-danger is-light mt-3 is-align-self-flex-start"
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
