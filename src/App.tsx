import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [people] = useState(peopleFromServer);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);
  const [enteredText, setEnteredText] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [message, setMessage] = useState('No selected person');
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const debounceDelay = 300;

  const filterPeople = useCallback((value: string) => {
    if (value.trim() === '') {
      setFilteredPeople(people);
    } else {
      const filtered = people.filter(person => person.name.toLowerCase().includes(value.toLowerCase()));
      setFilteredPeople(filtered);
    }
  }, [people]);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEnteredText(value);
    setShowDropdown(true);
    if (selectedPerson) {
      setSelectedPerson(null);
      setMessage('No selected person');
    }
    
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      filterPeople(value);
    }, debounceDelay);
  };

  const onSelected = (person: Person) => {
    setSelectedPerson(person);
    setMessage(`${person.name} (${person.born} - ${person.died})`);
    setEnteredText(person.name);
    setShowDropdown(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">{message}</h1>

        <div className={`dropdown ${showDropdown ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={enteredText}
              onChange={onInputChange}
              onFocus={() => setShowDropdown(true)}
            />
          </div>

          {showDropdown && (
            <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
              <div className="dropdown-content">
                {filteredPeople.length > 0 ? (
                  filteredPeople.map(person => (
                    <div 
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={`${person.name}-${person.born}`} 
                      onClick={() => onSelected(person)}>
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item" data-cy="no-suggestions-message">
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
