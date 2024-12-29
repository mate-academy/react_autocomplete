import React, { useState, useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AutocompleteProps {
  delay?: number;
  onSelected: (person: Person | null) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ delay = 300, onSelected }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
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
    if (debouncedValue === '') {
      setSuggestions(peopleFromServer);
    } else {
      const filteredSuggestions = peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(debouncedValue.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  }, [debouncedValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value === '') {
      onSelected(null); // Очистити вибрану особу, коли введення порожнє
    } else {
      onSelected(null); // Очистити вибрану особу, коли введення змінюється
    }
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setSuggestions([]);
    onSelected(person);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
        />
      </div>
      {suggestions.length > 0 ? (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                onClick={() => handleSuggestionClick(person)}
                data-cy="suggestion-item"
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="notification is-danger is-light mt-3"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
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
          {selectedPerson ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})` : 'No selected person'}
        </h1>
        <Autocomplete delay={300} onSelected={handleSelectedPerson} />
      </main>
    </div>
  );
};
