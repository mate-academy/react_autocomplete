import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { useState } from 'react';
import { Person } from './types/Person';
import { useEffect } from 'react';

interface AppProps {
  delay?: number;
  onSelected?: (person: Person | null) => void;
}

export const App: React.FC<AppProps> = ({ delay = 300, onSelected }) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  useEffect(() => {
    if (debouncedValue.trim() === '') {
      setFilteredPeople(peopleFromServer);
    } else {
      setFilteredPeople(
        peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(debouncedValue.toLowerCase()),
        ),
      );
    }
  }, [debouncedValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (selectedPerson) {
      setSelectedPerson(null);
      if (onSelected) {
        onSelected(null);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setIsFocused(false);
    if (onSelected) {
      onSelected(person);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {isFocused && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.length > 0 ? (
                  filteredPeople.map(person => (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={`${person.name}-${person.born}`}
                      onMouseDown={() => handleSuggestionClick(person)}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  ))
                ) : (
                  <div
                    className="notification is-danger is-light"
                    role="alert"
                    data-cy="no-suggestions-message"
                  >
                    <p className="has-text-danger">No matching suggestions</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
