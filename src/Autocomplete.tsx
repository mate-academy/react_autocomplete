/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import { Person } from './types/Person';

interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  debounceDelay?: number;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  debounceDelay = 300
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsActive(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value === '') {
      setSuggestions(people);
      onSelected(null);
    } else {
      timeoutRef.current = setTimeout(() => {
        const filteredPeople = people.filter(person =>
          person.name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredPeople);
      }, debounceDelay);
    }
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setIsActive(false);
    onSelected(person);
  };

  const handleInputFocus = () => {
    setIsActive(true);
    if (inputValue === '') {
      setSuggestions(people);
    }
  };

  return (
    <div className={`dropdown ${isActive ? 'is-active' : ''}`}>
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

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {suggestions.length > 0 ? (
            suggestions.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSuggestionClick(person)}
              >
                <p className={`has-text-${person.sex === 'm' ? 'link' : 'danger'}`}>
                  {person.name}
                </p>
              </div>
            ))
          ) : (
            <div className="dropdown-item">
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
