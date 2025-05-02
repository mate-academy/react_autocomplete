import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

// Define Person type based on test and requirements
type Person = {
  name: string;
  born: number;
  died: number;
};

// Props for our Autocomplete component
type AutocompleteProps = {
  suggestions: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

const Autocomplete: React.FC<AutocompleteProps> = ({
  suggestions,
  delay = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<Person[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [lastFilterText, setLastFilterText] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input text
  const filterSuggestions = useCallback(
    (text: string) => {
      if (text === lastFilterText) {
        return; // Don't filter again if text hasn't changed
      }

      setLastFilterText(text);

      if (!text.trim()) {
        setFilteredSuggestions(suggestions);

        return;
      }

      const filtered = suggestions.filter(person =>
        person.name.toLowerCase().includes(text.toLowerCase()),
      );

      setFilteredSuggestions(filtered);
    },
    [suggestions, lastFilterText],
  );

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputValue(value);

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      filterSuggestions(value);
    }, delay);

    // If input value changes, clear selected person
    onSelected(null);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsActive(true);
    if (!inputValue.trim()) {
      setFilteredSuggestions(suggestions);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setIsActive(false);
    onSelected(person);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className={`dropdown ${isActive ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            ref={inputRef}
          />
        </div>

        {isActive && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((person, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleSuggestionClick(person)}
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
        )}
      </div>
    </>
  );
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handlePersonSelected = (person: Person | null) => {
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

        <Autocomplete
          suggestions={peopleFromServer}
          delay={300}
          onSelected={handlePersonSelected}
        />
      </main>
    </div>
  );
};
