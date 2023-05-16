/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];
  const [query, setQuery] = useState('');
  const [delayedQuery, setDelayedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Person[]>([]);

  useEffect(() => {
    setSearchResults(peopleFromServer.filter(
      (person) => person.name.toLowerCase()
        .includes(delayedQuery.toLowerCase()),
    ));
  }, [peopleFromServer, delayedQuery]);

  const delayQuery = useCallback(
    debounce(setDelayedQuery, 500),
    [],
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    delayQuery(event.target.value);
  };

  const clearQuery = () => {
    setQuery('');
    setSearchResults([]);
  };

  return (
    <main className="section">
      <h1 className="title">{`${name} (${born} = ${died})`}</h1>

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
                <div className="dropdown-item" key={person.slug}>
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
