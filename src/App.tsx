import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [currentInput, setCurrentInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      const filteredPeople = peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(currentInput.toLowerCase()),
      );
      setFilteredSuggestions(filteredPeople);

      // Reset selected person if input changes and no match exactly
      if (
        selectedPerson &&
        selectedPerson.name.toLowerCase() !== currentInput.toLowerCase()
      ) {
        setSelectedPerson(null);
      }
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [currentInput]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        {filteredSuggestions.length === 0 && currentInput.trim() !== '' && (
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

        <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={currentInput}
              onChange={e => {
                setCurrentInput(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredSuggestions.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  onClick={() => {
                    setCurrentInput(person.name);
                    setSelectedPerson(person);
                    setIsDropdownOpen(false);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
