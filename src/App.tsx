import React, { useCallback, useState } from 'react';

import cn from 'classnames';
import debounce from 'lodash.debounce';

import './App.scss';

import { peopleFromServer } from './data/people';

import { Person } from './types/Person';

const peopleWithId: Person[] = peopleFromServer.map((person, index) => {
  return {
    ...person,
    id: index + 1,
  };
});

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const { name, born, died } = currentPerson || {};

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value.trimStart());
    applyQuery(e.target.value);
  };

  const handleSelectPerson = (user: Person) => {
    setCurrentPerson(user);
    setQuery(user.name);
    setIsInputFocused(false);
  };

  const filteredPeopleByName = peopleWithId.filter(person =>
    person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase()),
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {currentPerson && currentPerson.name === query && query
            ? `${name} (${born} - ${died})`
            : `No selected person`}
        </h1>
        <div
          className={cn('dropdown', {
            'is-active': isInputFocused,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setIsInputFocused(!isInputFocused)}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {filteredPeopleByName.length > 0 && (
              <div className="dropdown-content">
                {filteredPeopleByName.map(person => (
                  <div
                    key={person.id}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                  >
                    <p
                      className={cn({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                      onClick={() => {
                        handleSelectPerson(person);
                      }}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {!filteredPeopleByName.length && (
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
