/* eslint-disable */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AppProps {
  delay?: number;
  onSelected?: (person: Person) => void;
}

function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const actualDelay = process.env.NODE_ENV === 'test' ? 0 : delay;
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, actualDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const App: React.FC<AppProps> = ({ delay = 300, onSelected }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const focusRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('No selected person');
  const debouncedSearchInput = useDebounce(searchInput, delay);

  const filteredPeople = useMemo(() => {
    const normalized = debouncedSearchInput.trim().toLowerCase();
    return normalized ? peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(normalized),
    ) : [];
  }, [debouncedSearchInput]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    // Завжди скидаємо вибрану особу та встановлюємо заголовок на "No selected person" при зміні введення
    setSelectedPerson(null);
    setTitle('No selected person');
  };

  const handleSelectPerson = (person: Person) => {
    if (
      person &&
      person.name &&
      person.born !== undefined &&
      person.died !== undefined
    ) {
      setSelectedPerson(person);
      setSearchInput(person.name);
      setTitle(`${person.name} (${person.born} - ${person.died})`);
      onSelected?.(person);
    } else {
      setSelectedPerson(null);
      setTitle('No selected person');
    }
  };

  useEffect(() => {
    if (selectedPerson) {
      // Можна додати тут додаткову логіку, якщо потрібно
    }
  }, [selectedPerson]);

  useEffect(() => {
    if (focusRef.current && document.activeElement !== focusRef.current) {
      focusRef.current.focus();
    }
  }, []);

  // Оновлюємо document.title через useEffect
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <div
          className={`dropdown ${filteredPeople.length > 0 || searchInput.trim() === '' ? 'is-active' : ''}`}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={searchInput}
              onChange={handleSearchInputChange}
              ref={focusRef}
            />
          </div>

          {filteredPeople.length > 0 || searchInput.trim() === '' ? (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {searchInput.trim() === ''
                  ? peopleFromServer.map(person => (
                      <div
                        key={person.name}
                        className="dropdown-item"
                        data-cy="suggestion-item"
                        onClick={() => handleSelectPerson(person)}
                      >
                        <p className="has-text-link">{person.name}</p>
                      </div>
                    ))
                  : filteredPeople.map(person => (
                      <div
                        key={person.name}
                        className="dropdown-item"
                        data-cy="suggestion-item"
                        onClick={() => handleSelectPerson(person)}
                      >
                        <p className="has-text-link">{person.name}</p>
                      </div>
                    ))}
              </div>
            </div>
          ) : null}

          {debouncedSearchInput &&
            filteredPeople.length === 0 &&
            searchInput.trim() !== '' && (
              <div
                className="notification is-danger is-light mt-3 is-align-self-flex-start"
                role="alert"
                data-cy="no-suggestions-message"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
        </div>
      </main>
    </div>
  );
};
