import './App.scss';
import { Person } from './types/Person';

import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';

import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [containerActive, setContainerActive] = useState(false);

  const debouncedSetInputValue = useCallback(
    debounce((value: string) => {
      setInputValue(value);
    }, 300),
    [],
  );

  const filterPeople = useCallback(() => {
    const trimmedInput = inputValue.trim().toLowerCase();

    if (trimmedInput === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(trimmedInput),
    );
  }, [inputValue]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetInputValue(event.target.value);
    setCurrentPerson(null);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {currentPerson
            ? `${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${containerActive ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={() => setContainerActive(true)}
              onBlur={() => setContainerActive(false)}
              onChange={handleInput}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filterPeople().map((person) => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  onMouseDown={() => {
                    setCurrentPerson(person);
                    setContainerActive(false);
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

        {inputValue.trim() !== '' && filterPeople().length === 0 && (
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
