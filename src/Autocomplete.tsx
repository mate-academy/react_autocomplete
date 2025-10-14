import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';

interface Person {
  name: string;
  born: number;
  died: number;
}

interface AutocompleteProps {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay = 100,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>(people);
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const filterSuggestions = debounce((query: string) => {
    const filtered = people.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase()),
    );

    setSuggestions(filtered);
  }, delay);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputValue(value);
    setIsDropdownActive(true); // Ensure dropdown stays open
    filterSuggestions(value);
    onSelected(null);
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setIsDropdownActive(false);
    onSelected(person);
  };

  const handleFocus = () => {
    setIsDropdownActive(true);
    if (!inputValue) {
      setSuggestions(people);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsDropdownActive(false), 300);
  };

  useEffect(() => {
    return () => {
      filterSuggestions.cancel();
    };
  }, [filterSuggestions, suggestions]);

  return (
    <div className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-cy="search-input"
        />
      </div>
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {isDropdownActive && (
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(person => (
                <div
                  key={person.name}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSuggestionClick(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
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
        )}
      </div>
    </div>
  );
};
