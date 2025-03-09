import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [dropdownIsActive, setDropdownIsActive] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const debounceSearch = useMemo(() => debounce(setSearchValue, 300), []);
  const visiblePeople = useMemo(() => {
    const filteredPeople = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(searchValue.toLowerCase()),
    );

    return filteredPeople;
  }, [searchValue]);

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      debounceSearch(event.target.value);
      setCurrentPerson(null);
    },
    [],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {currentPerson
            ? `${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`
            : `No selected person`}
        </h1>

        <div
          className={classNames('dropdown', { 'is-active': dropdownIsActive })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={() => setDropdownIsActive(true)}
              onBlur={() => setDropdownIsActive(false)}
              onChange={handleInput}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {visiblePeople.map((person, index) => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={index + 1}
                  onMouseDown={() => {
                    setCurrentPerson(person);
                    setDropdownIsActive(false);
                  }}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {dropdownIsActive && visiblePeople.length === 0 && (
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
