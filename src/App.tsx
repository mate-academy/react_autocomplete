import React, { useState, useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AutocompleteProps {
  delay?: number;
  onSelected: (person: Person | null) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  delay = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<Person[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    if (inputValue.trim() !== '') {
      const handler = setTimeout(() => {
        if (inputValue.trim() === '') {
          setFilteredSuggestions(peopleFromServer);
        } else {
          setFilteredSuggestions(
            peopleFromServer.filter(person =>
              person.name.toLowerCase().includes(inputValue.toLowerCase()),
            ),
          );
        }
      }, delay);

      return () => clearTimeout(handler);
    }
  }, [inputValue, delay]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setInputValue(value);
    setIsDropdownOpen(true);

    if (selectedPerson) {
      setSelectedPerson(null);
      onSelected(null);
    }
  };

  const handleFocus = () => {
    if (inputValue.trim() === '') {
      setFilteredSuggestions(peopleFromServer);
    }

    setIsDropdownOpen(true);
  };

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setIsDropdownOpen(false);
    onSelected(person);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          className="input"
          placeholder="Enter a part of the name"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          data-cy="search-input"
        />
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  onClick={() => handleSelect(person)}
                  data-cy="suggestion-item"
                >
                  {person.name}
                </div>
              ))
            ) : (
              <div
                className="dropdown-item has-text-danger"
                data-cy="no-suggestions-message"
              >
                No matching suggestions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete delay={300} onSelected={handleSelectedPerson} />
      </main>
    </div>
  );
};
