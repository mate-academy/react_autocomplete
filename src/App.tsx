// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from 'lodash/debounce';
import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [chosenPerson, setChosenPerson] = useState<Person | null>(null);
  const [rawInput, setRawInput] = useState<string>('');
  const [searchPerson, setSearchPerson] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const { name, born, died } = chosenPerson || {};

  const debouncedUpdate = useMemo(
    () =>
      debounce((value: string) => {
        setSearchPerson(value);
      }, 300),
    [],
  );

  // фільтрація по searchPerson
  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(searchPerson.toLowerCase()),
    );
  }, [searchPerson]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setRawInput(value);

      // скидаємо вибір, якщо щось нове ввели
      if (chosenPerson) {
        setChosenPerson(null);
      }

      debouncedUpdate(value);
    },
    [chosenPerson, debouncedUpdate],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {chosenPerson ? `${name} (${born} - ${died})` : 'No selected person'}
        </h1>

        <div
          className={isFocused ? 'dropdown is-active' : 'dropdown'}
          data-cy="search-dropdown"
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={rawInput}
              data-cy="search-input"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={handleInputChange}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.name}
                  className="dropdown-item has-text-link"
                  data-cy="suggestion-item"
                  onClick={() => {
                    setChosenPerson(person);
                    setRawInput(person.name);
                    setSearchPerson(person.name);
                    setIsFocused(false);
                  }}
                >
                  {person.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredPeople.length === 0 && (
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
