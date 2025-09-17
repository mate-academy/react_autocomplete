// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from 'lodash/debounce';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type AppProps = {
  delay?: number; // debounce delay
  onSelected?: (person: Person) => void;
};

export const App: React.FC<AppProps> = ({ delay = 300, onSelected }) => {
  const [chosenPerson, setChosenPerson] = useState<Person | null>(null);
  const [rawInput, setRawInput] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const { name, born, died } = chosenPerson || {};

  // Debounced handler для внутрішньої оптимізації
  const debouncedUpdate = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedQuery(value.trim());
      }, delay),
    [delay],
  );

  useEffect(() => {
    return () => debouncedUpdate.cancel();
  }, [debouncedUpdate]);

  // Скидаємо вибрану особу, якщо input не співпадає з нею
  useEffect(() => {
    if (chosenPerson && rawInput.trim() !== chosenPerson.name) {
      setChosenPerson(null);
    }
  }, [rawInput, chosenPerson]);

  // Фільтрація миттєво по rawInput, щоб dropdown завжди відображався
  const filteredPeople = useMemo(() => {
    const trimmed = rawInput.trim();

    if (trimmed === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(trimmed.toLowerCase()),
    );
  }, [rawInput]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setRawInput(value);

      if (value.trim() === '') {
        debouncedUpdate.cancel();
        setDebouncedQuery('');
      } else {
        debouncedUpdate(value);
      }
    },
    [debouncedUpdate],
  );

  const handleSelect = useCallback(
    (person: Person) => {
      debouncedUpdate.cancel();
      setChosenPerson(person);
      setRawInput(person.name);
      setDebouncedQuery(person.name);
      setIsFocused(false);

      if (onSelected) {
        onSelected(person);
      }
    },
    [debouncedUpdate, onSelected],
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

          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content" data-cy="suggestions-list">
              {rawInput.trim() !== '' && filteredPeople.length === 0 && (
                <div
                  className="dropdown-item is-disabled has-text-grey"
                  data-cy="no-suggestions-message"
                >
                  No matching suggestions
                </div>
              )}

              {filteredPeople.map(person => (
                <div
                  key={person.name}
                  className="dropdown-item has-text-link"
                  data-cy="suggestion-item"
                  onMouseDown={e => {
                    e.preventDefault(); // запобігає blur до вибору
                    handleSelect(person);
                  }}
                >
                  {person.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
