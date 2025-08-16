import { useRef } from "react";
import { useState, useEffect } from "react";
import debounce from 'lodash.debounce';
import React, { useCallback } from 'react';

interface PersonType {
  id: number;
  name: string;
  born: number;
  died: number;
}

interface AutocompleteProps {
  delay?: number;
  onSelected: (person: PersonType | null) => void;
  people: PersonType[];
  placeholder?: string;
}


export const Autocomplete: React.FC<AutocompleteProps> = ({ people, onSelected, placeholder, delay = 300 }) => { 
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<PersonType[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<PersonType | null>(null);
  
  const lastFilteredValue = useRef<string>('');
  const applyFiltering = useCallback(
    debounce((query: string) => {
      if (query.trim() === '') {
        setSuggestions(people);
      } else {
        const filtered = people.filter(person =>
          person.name.toLowerCase().includes(query.trim().toLowerCase())

        );
        setSuggestions(filtered);
      }
    }, delay),
    [people, delay]
  );

  useEffect(() => {
    if (selectedSuggestions && value !== selectedSuggestions.name) {
      onSelected(null);
      setSelectedSuggestions(null);
    }

    if (value !== "" && value.trim() === "") {
      return;
    }

    if (lastFilteredValue.current !== value) {
    applyFiltering(value);
    lastFilteredValue.current = value;
    }

    return () => {
      applyFiltering.cancel();
    };
  }, [value, applyFiltering, selectedSuggestions, onSelected]);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setIsDropdownOpen(true);
  };
  
  const handleSelect = (person: PersonType) => {
    setValue(person.name);
    setSelectedSuggestions(person);
    onSelected(person);
    setIsDropdownOpen(false);
  };

  const handleFocus = () => {
    if (value === '') {
      setSuggestions(people);
    }
    setIsDropdownOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const showNoSuggestions = suggestions.length === 0 && value.trim() !== '';

  return (
    <div className={`dropdown ${isDropdownOpen ? "is-active" : ""}`}>
      <input
        type="text"
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-cy="search-input"
      />
      {isDropdownOpen && (
        <div className="dropdown-menu">
          {showNoSuggestions ? (
            <div className="dropdown-item has-text-danger" data-cy="no-suggestions-message">
              No matching suggestions
            </div>
          ) : (
            suggestions.map(person => (
              <div
                key={person.id}
                className="dropdown-item"
                onClick={() => handleSelect(person)}
                data-qa="suggestion"
              >
                {person.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

