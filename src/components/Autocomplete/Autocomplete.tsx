import React, { useState, useEffect } from 'react';
import './Autocomplete.scss';
import { Person } from '../../types/Person';

interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  onInputChange: () => void;
  delay: number;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  onInputChange,
  delay,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isNoMatch, setIsNoMatch] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue === '') {
        setSuggestions(people);
        setIsNoMatch(false);
      } else {
        const filteredPeople = people.filter(person =>
          person.name.toLowerCase().includes(inputValue.toLowerCase()),
        );

        setSuggestions(filteredPeople);
        setIsNoMatch(filteredPeople.length === 0 && selectedPerson === null);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [inputValue, people, delay, selectedPerson]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value);
    setSelectedPerson(null);
    onInputChange();
  };

  const handleSelectPerson = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    onSelected(person);
    setSuggestions([]);
    setIsNoMatch(false);
  };

  const isDropdownActive =
    suggestions.length > 0 || (inputValue !== '' && isNoMatch);

  return (
    <div className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
        />
      </div>

      {isDropdownActive && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(person => (
              <div
                key={person.slug}
                className="dropdown-item has-text-black-bis"
                data-cy="suggestion-item"
                onClick={() => handleSelectPerson(person)}
              >
                <p className="has-text-black-bis">{person.name}</p>
              </div>
            ))}

            {isNoMatch && (
              <div
                className="dropdown-item message"
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
