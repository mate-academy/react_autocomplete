import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNoSuggestions, setShowNoSuggestions] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const debounceTimer = useRef<number | null>(null);
  const lastSearchTerm = useRef('');
  const delay = 300;

  const filterPeople = (searchTerm: string): Person[] => {
    if (!searchTerm) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputValue(value);

    if (selectedPerson) {
      setSelectedPerson(null);
    }

    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(() => {
      if (lastSearchTerm.current === value) {
        return;
      }

      lastSearchTerm.current = value;
      const filtered = filterPeople(value);

      setSuggestions(filtered);
      setShowNoSuggestions(filtered.length === 0 && value.length > 0);
      setIsDropdownOpen(true);
    }, delay);
  };

  const handleInputFocus = () => {
    if (inputValue === '') {
      setSuggestions(peopleFromServer);
      setShowNoSuggestions(false);
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const getPersonTextColor = (person: Person): string => {
    return person.name.toLowerCase().includes('elisabeth') ||
      person.name.toLowerCase().includes('petronella')
      ? 'has-text-danger'
      : 'has-text-link';
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          {isDropdownOpen && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {suggestions.map((person, index) => (
                  <div
                    key={`${person.name}-${index}`}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleSuggestionClick(person)}
                    style={{ cursor: 'pointer' }}
                  >
                    <p className={getPersonTextColor(person)}>{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showNoSuggestions && (
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
