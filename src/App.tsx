/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Person[] | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const lowerQuery = event.target.value.toLowerCase();

    setQuery(lowerQuery);

    const results = peopleFromServer.filter(
      (person) => person.name.toLowerCase().includes(lowerQuery),
    );

    setSearchResults(results);
  };

  const clearQuery = () => {
    setQuery('');
    setSearchResults(null);
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
            <span
              className="icon is-right"
            >
              <button
                type="button"
                className="delete"
                onClick={() => clearQuery()}
              />
            </span>
          </div>
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {searchResults ? (
              searchResults.map((person) => (
                <div className="dropdown-item" key={person.slug}>
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
              <div className="dropdown-item">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
