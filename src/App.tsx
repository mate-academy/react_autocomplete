import React, { useEffect, useState, useRef } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [filteredPeople, setFilteredPeople] = useState(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<null | {
    name: string;
    born: number;
    died: number;
  }>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  const dropdownRef = useRef<HTMLDivElement | null>(null);


  const debounceDelay = 300;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputValue(value);
    setSelectedPerson(null);
    setIsDropdownVisible(true);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      if (value === '') {
        setFilteredPeople(peopleFromServer);
      } else {
        setFilteredPeople(
          peopleFromServer.filter(person =>
            person.name.toLowerCase().includes(value.toLowerCase()),
          ),
        );
      }
    }, debounceDelay);

    setDebounceTimer(newTimer);
  };

  const handleSelectPerson = (person: {
    name: string;
    born: number;
    died: number;
  }) => {
    setSelectedPerson(person);
    setInputValue(person.name);
    setIsDropdownVisible(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isDropdownVisible ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsDropdownVisible(true)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.length > 0 ? (
                filteredPeople.map((person, index) => (
                  <div
                    key={`${person.name}-${index}`} // Генерація унікального ключа
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleSelectPerson(person)}
                  >
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
        </div>
      </main>
    </div>
  );
};
