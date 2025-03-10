import React, { useState, useEffect } from 'react';
import { Person } from '../data/people';

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
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  useEffect(() => {
    if (debouncedValue === '') {
      setFilteredPeople(people);
    } else {
      setFilteredPeople(
        people.filter(person =>
          person.name.toLowerCase().includes(debouncedValue.toLowerCase()),
        ),
      );
    }
  }, [debouncedValue, people]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (selectedPerson) {
      setSelectedPerson(null);
      onSelected(null);
    }
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    onSelected(person);
    setFilteredPeople([]);
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
          data-cy="search-input"
        />
      </div>

      {filteredPeople.length > 0 ? (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.id}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSuggestionClick(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
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
  );
};
