import React, { useState, useCallback } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const filteredPersons = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          <h1 className="title" data-cy="title">
            {selectedPerson.name} ({selectedPerson.born} - {selectedPerson.died}
            )
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                applyQuery(event.target.value);
                setSelectedPerson(null);
              }}
              onFocus={() => setIsDropdownActive(true)}
            />
          </div>

          {isDropdownActive && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPersons.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => {
                      setSelectedPerson(person);
                      setQuery(person.name);
                      setIsDropdownActive(false);
                    }}
                  >
                    <p
                      className={cn({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!filteredPersons.length && (
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
