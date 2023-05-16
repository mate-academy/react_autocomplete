/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [delayedQuery, setDelayedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [isQueryCleared, setIsQueryCleared] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    if (isQueryCleared) {
      setDelayedQuery('');
      setSearchResults([]);
      setIsQueryCleared(false);
    } else {
      setSearchResults(peopleFromServer.filter(
        (person) => person.name.toLowerCase()
          .includes(delayedQuery.toLowerCase()),
      ));
    }
  }, [peopleFromServer, delayedQuery, isQueryCleared]);

  const delayQuery = useCallback(
    debounce(setDelayedQuery, 500),
    [],
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsQueryCleared(false);
    delayQuery(event.target.value);
  };

  const clearQuery = () => {
    setQuery('');
    setIsQueryCleared(true);
    setSearchResults([]);
    setSelectedPerson(null);
  };

  const selectPerson = (person: Person) => {
    setSelectedPerson(person);
  };

  return (
    <main className="section">
      {selectedPerson ? (<h1 className="title">{`${selectedPerson?.name} (${selectedPerson?.born} = ${selectedPerson?.died})`}</h1>
      ) : (<h1 className="title">No person is selected</h1>)}

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <div className="control has-icons-right">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onChange={handleSearch}
            />
            {query
              && (
                <span
                  className="icon is-right"
                >
                  <button
                    type="button"
                    className="delete"
                    onClick={() => clearQuery()}
                  />
                </span>
              )}
          </div>
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {searchResults.length === 0 ? (
              <div className="dropdown-item">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            ) : (
              searchResults.map((person) => (
                <button
                  type="button"
                  className="dropdown-item button is-white"
                  key={person.slug}
                  onClick={() => selectPerson(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
