import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [findPeople, setFindPeople] = useState<Person | null>(null);

  const queryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const filterPeople = peopleFromServer
    .filter(people => people.name.toLocaleLowerCase().includes(query));

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {findPeople
            ? `${findPeople.name} (${findPeople.born} - ${findPeople.died})`
            : 'No Selected Person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={queryChange}
            />
          </div>

          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
          >
            <div className="dropdown-content">
              {filterPeople.map(people => (
                <div
                  key={people.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                >
                  <button
                    type="button"
                    className={cn(
                      'has-text-link',
                      { 'has-text-danger': people.sex === 'f' },
                    )}
                    onClick={() => setFindPeople(people)}
                  >
                    {people.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filterPeople.length === 0 && (
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
