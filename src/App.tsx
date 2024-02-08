import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const getPreparedPeople = (people: Person[], query?: string) => {
  if (query) {
    return people
      .filter(person => person
        .name.toLocaleUpperCase().includes(query.toLocaleUpperCase()));
  }

  return people;
};

export const App: React.FC = () => {
  const [title, setTitle] = useState('No matching suggestions');
  const [query, setQuery] = useState('');
  const [visbleList, setVisibleList] = useState(false);

  const listNamesPeople = getPreparedPeople(peopleFromServer, query);

  const handleQueryCgange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryCgange}
              onFocus={() => setVisibleList(true)}
              onBlur={() => setVisibleList(false)}
            />
          </div>

          <div
            className={cn(
              'dropdown-menu',
              { 'is-hidden': listNamesPeople.length === 0 },
            )}
            role="menu"
            data-cy="suggestions-list"
          >
            {visbleList && (
              <ul className="dropdown-content">
                {listNamesPeople.map(person => {
                  const {
                    name,
                    slug,
                    born,
                    died,
                  } = person;

                  return (
                    <li
                      key={slug}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                    >
                      <button
                        type="button"
                        className="button is-link is-light"
                        onClick={() => {
                          setQuery(name);
                          setTitle(`${name} (${born} ${died})`);
                        }}
                      >
                        {name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

          </div>
        </div>

        {listNamesPeople.length === 0 && (
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
