import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Person {
  name: string;
  born: number;
  died?: number;
  sex?: string;
}

interface AutocompleteProps {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
  placeholder?: string;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay = 300,
  onSelected,
  placeholder = 'Enter a part of the name',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousInputRef = useRef<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filterSuggestions = useCallback(
    (text: string): Person[] => {
      if (!text.trim()) {
        return people;
      }

      const searchText = text.toLowerCase();

      return people.filter(person =>
        person.name.toLowerCase().includes(searchText),
      );
    },
    [people],
  );

  const updateSuggestions = useCallback(() => {
    if (inputValue === previousInputRef.current) {
      return;
    }

    previousInputRef.current = inputValue;
    const filtered = filterSuggestions(inputValue);

    setSuggestions(filtered);
    setIsDropdownActive(true);
  }, [inputValue, filterSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputValue(value);

    if (selectedPerson && value !== selectedPerson.name) {
      setSelectedPerson(null);
      onSelected(null);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(updateSuggestions, delay);
  };

  const handleInputFocus = () => {
    if (!inputValue) {
      setSuggestions(people);
    }

    setIsDropdownActive(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsDropdownActive(false);
    }, 200);
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setIsDropdownActive(false);
    onSelected(person);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const hasSuggestions = suggestions.length > 0;
  const showNoSuggestions = inputValue && !hasSuggestions && isDropdownActive;

  return (
    <div className="autocomplete" ref={dropdownRef}>
      <div className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder={placeholder}
            className="input"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyPress={handleKeyPress}
            data-cy="search-input"
          />
        </div>

        {isDropdownActive && hasSuggestions && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {suggestions.map((person, index) => (
                <div
                  key={`${person.name}-${index}`}
                  className="dropdown-item"
                  onClick={() => handleSuggestionClick(person)}
                  onMouseDown={e => e.preventDefault()}
                  data-cy="suggestion-item"
                >
                  <p
                    className={
                      person.sex === 'f' ? 'has-text-danger' : 'has-text-link'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showNoSuggestions && (
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
    </div>
  );
};
