import { Person } from '../../types/Person';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { DropdownList } from '../dropdownList';

type AutoCompleteProps = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  debounceDelay?: number;
};

export const AutoComplete: React.FC<AutoCompleteProps> = ({
  people,
  onSelected,
  debounceDelay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [querry, setQuery] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Debounce logic: update debouncedQuery after delay
  useEffect(() => {
    // clear previouse timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // set new timeout
    timeoutRef.current = setTimeout(() => {
      setQuery(inputValue);
    }, debounceDelay);

    // cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, debounceDelay]);

  // Filter suggestions based on debounced query
  const filteredPeople = useMemo(() => {
    if (!querry.trim()) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(querry.toLowerCase()),
    );
  }, [querry, people]);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onSelected(null);
  };

  // handle input focus
  const handleInputFocus = () => {
    setIsOpen(true);
  };

  //handle person selection
  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    onSelected(person);
    setIsOpen(false);
  };

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
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

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              <DropdownList
                suggestions={filteredPeople}
                onSelect={handleSelect}
              />
            ) : (
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
        </div>
      )}
    </div>
  );
};
