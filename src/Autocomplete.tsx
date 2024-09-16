/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */

import { Person } from '../src/types/Person';
import debounce from 'lodash/debounce';
import React, { useMemo, useState } from 'react';

interface AutocompleteProps {
  persons: Person[];
  debounceDelay?: number;
  onSelected: (person: Person) => void;
  onClearSelection: () => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  persons,
  onSelected,
  onClearSelection,
  debounceDelay = 300,
}) => {
  const [suggesting, setSuggestions] = useState<Person[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<Person | null>(null);

  const fetchSuggestions = useMemo(
    () =>
      debounce((value: string) => {
        if (value === '') {
          setSuggestions(persons);
        } else {
          const filter = persons.filter(person =>
            person.name.toLowerCase().includes(value.toLowerCase()),
          );

          setSuggestions(filter);
        }
      }, debounceDelay),
    [persons, debounceDelay],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setInputValue(value);

    if (selectedPeople && value !== selectedPeople.name) {
      setSelectedPeople(null);
      onClearSelection();
    }

    fetchSuggestions(value);
  };

  const handleSuggestionClick = (person: Person) => {
    setSelectedPeople(person);
    setInputValue(person.name);
    setSuggestions([]);
    onSelected(person);
  };

  const handleInputFocus = () => {
    if (inputValue.length === 0) {
      setSuggestions(persons);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setSuggestions([]), 100);
  };

  return (
    <div className="dropdown is-active">
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
          {suggesting.length > 0
            ? suggesting.map(person => (
                <div
                  key={person.name}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSuggestionClick(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            : inputValue.length > 0 &&
              !selectedPeople && (
                <div
                  className="notification is-danger is-light mt-3"
                  role="alert"
                  data-cy="no-suggestions-message"
                >
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              )}
        </div>
      </div>
    </div>
  );
};
