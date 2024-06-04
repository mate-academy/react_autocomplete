import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const debouncedSuggestions = useMemo(
    () =>
      debounce((value: string) => {
        const filteredSuggestions = value
          ? peopleFromServer.filter(person => person.name.includes(value))
          : peopleFromServer;

        setSuggestions(filteredSuggestions);
      }, 300),
    [],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setSelectedPerson(null);
    debouncedSuggestions(event.target.value);
    setIsDropdownVisible(true);
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setSuggestions([]);
    setIsDropdownVisible(false);
  };

  const handleInputFocus = () => {
    setIsDropdownVisible(true);
    if (!inputValue) {
      setSuggestions(peopleFromServer);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          <h1 className="title" data-cy="title">
            {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div className={`dropdown ${isDropdownVisible ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>

          {isDropdownVisible && !!suggestions.length && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {suggestions.map(person => (
                  <div
                    key={person.name}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleSuggestionClick(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!suggestions.length && inputValue && !selectedPerson && (
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
