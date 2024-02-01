import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);

  const { name, born, died } = selectPerson || {};

  const handlePesonClick = (person: Person, namePerson: string) => {
    setSelectPerson(person);
    setQuery(namePerson);
  };

  const queryInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectPerson(null);
  };

  const currentPerson = peopleFromServer
    .filter(people => people.name.toLowerCase()
      .includes(query.toLowerCase()));

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectPerson
            ? `${name} (${born} - ${died})`
            : 'No Selected Person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={queryInputChange}
            />
          </div>

          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
          >
            {currentPerson.length > 0 && (
              <div className="dropdown-content">
                {currentPerson.map(person => {
                  const { name: namePerson, sex, slug } = person;

                  return (
                    <button
                      type="button"
                      className="dropdown-item button is-white"
                      data-cy="suggestion-item"
                      key={slug}
                      onClick={() => handlePesonClick(person, namePerson)}
                    >
                      <p
                        className={cn(
                          'has-text-link',
                          { 'has-text-danger': sex === 'f' },
                        )}
                      >
                        {namePerson}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {!currentPerson.length && (
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
