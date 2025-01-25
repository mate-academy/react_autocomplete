import React, { useState, useEffect, ChangeEvent } from 'react';
import { Person } from '../types/Person';

interface AutoCompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
}

export const AutoComplete: React.FC<AutoCompleteProps> = ({
  people,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [debouncedValue, setDebouncedValue] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const debounceDelay = 300;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue.trim());
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    if (debouncedValue === '') {
      setSuggestions(people);
    } else if (debouncedValue.length > 0) {
      setSuggestions(
        people.filter(person =>
          person.name.toLowerCase().includes(debouncedValue.toLowerCase()),
        ),
      );
    }
  }, [debouncedValue, people]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.trim() === '') {
      setSuggestions(people);
    }

    setInputValue(value);
    setIsDropdownVisible(true);
    onSelected(null);
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setSuggestions([]);
    setIsDropdownVisible(false);
    onSelected(person);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onFocus={() => setIsDropdownVisible(true)}
        />
      </div>

      {isDropdownVisible && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  onClick={() => handleSuggestionClick(person)}
                  data-cy="suggestion-item"
                >
                  <p className="has-text-link">{person.name}</p>
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
