/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash/debounce';

interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filterPeople = useCallback(
    (value: string) => {
      if (!value.trim()) {
        setSuggestions(people);

        return;
      }

      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(value.toLowerCase()),
      );

      setSuggestions(filtered);
    },
    [people],
  );

  const debouncedFilter = useCallback(
    (value: string) => {
      filterPeople(value);
    },
    [filterPeople],
  );

  const debouncedFilterWithDelay = useCallback(
    debounce(debouncedFilter, delay),
    [debouncedFilter, delay],
  );

  useEffect(() => {
    debouncedFilterWithDelay(inputValue);

    return () => {
      debouncedFilterWithDelay.cancel();
    };
  }, [inputValue, debouncedFilterWithDelay]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputValue(value);
    if (selectedPerson) {
      setSelectedPerson(null);
      onSelected(null);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!inputValue.trim()) {
      setSuggestions(people);
    }
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setIsOpen(false);
    onSelected(person);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          data-cy="search-input"
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(person => (
                <div
                  // Using person.id if available, or slug as fallback
                  // Ensure this key is unique and stable across renders
                  key={person.id || person.slug}
                  className="dropdown-item"
                  onClick={() => handleSuggestionClick(person)}
                  data-cy="suggestion-item"
                >
                  <p
                    className={`has-text-${
                      person.sex === 'm' ? 'link' : 'danger'
                    }`}
                  >
                    {person.name}
                  </p>
                </div>
              ))
            ) : (
              <div
                className="notification is-danger is-light mt-3 is-align-self-flex-start"
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
