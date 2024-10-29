/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { useState } from 'react';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

interface AutocompleteProps {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isDropDownActive, setIsDropDownActive] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filterSuggestions = debounce((value: string) => {
    const results = value
      ? people.filter(person =>
          person.name.toLowerCase().includes(value.toLowerCase()),
        )
      : people;

    setSuggestions(results);
    setIsDropDownActive(true);
  }, delay);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value);
    filterSuggestions(value);

    if (selectedPerson) {
      setSelectedPerson(null);
      onSelected(null);
    }
  };

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setInputValue(person.name);
    setSuggestions([]);
    setIsDropDownActive(false);
    onSelected(person);
  };

  const handleInputFocus = () => {
    if (!inputValue) {
      setSuggestions(people);
      setIsDropDownActive(true);
    }
  };

  return (
    <div className={`dropdown ${isDropDownActive ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          className="input"
          placeholder="Enter a part of the name"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          data-cy="search-input"
        />
      </div>

      {isDropDownActive && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  onClick={() => handleSelectPerson(person)}
                  data-cy="suggestion-item"
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
  );
};
