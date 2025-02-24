import React, { useState, useRef, useEffect } from 'react';
import { Person } from '../../types/Person';
import { peopleUUID } from '../../data/people';

interface AutocompleteProps {
  delay?: number;
  onSelected?: (person: Person | null) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  delay = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState('');
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const selectedPersonRef = useRef<Person | null>(null);

  useEffect(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [inputValue, delay]);

  useEffect(() => {
    if (debouncedValue.trim() === '') {
      setSuggestions(peopleUUID);
    } else {
      setSuggestions(
        peopleUUID.filter(person =>
          person.name.toLowerCase().includes(debouncedValue.toLowerCase()),
        ),
      );
    }
  }, [debouncedValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowDropdown(true);

    if (selectedPersonRef.current && onSelected) {
      onSelected(null);
      selectedPersonRef.current = null;
    }
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setShowDropdown(false);
    if (onSelected) {
      onSelected(person);
      selectedPersonRef.current = person;
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
    if (inputValue === '') {
      setSuggestions(peopleUUID);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 100);
  };

  return (
    <div className={`dropdown ${showDropdown ? 'is-active' : ''}`}>
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

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {suggestions.length > 0 ? (
            suggestions.map(person => (
              <button // change div to button
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSuggestionClick(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </button>
            ))
          ) : (
            <div className="dropdown-item" data-cy="no-suggestions-message">
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
