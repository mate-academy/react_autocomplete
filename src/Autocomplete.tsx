// Autocomplete.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Person } from './types/Person';

type AutocompleteProps = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [noSuggestions, setNoSuggestions] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<number | undefined>(undefined);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    if (inputValue.trim() === '' && inputValue !== selectedPerson?.name) {
      setFilteredPeople(people);
      setNoSuggestions(false);
      return;
    }

    const trimmedValue = inputValue.trim().toLowerCase();
    if (trimmedValue === '') {
      setFilteredPeople([]);
      setNoSuggestions(false);
      return;
    }

    const matchingPeople = people.filter(person =>
      person.name.toLowerCase().includes(trimmedValue)
    );

    setFilteredPeople(matchingPeople);
    setNoSuggestions(matchingPeople.length === 0);
  }, [inputValue, people, selectedPerson?.name]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value === inputValue) return;

    setInputValue(value);
    setSelectedPerson(null);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = window.setTimeout(() => {
      setInputValue(value);
    }, delay);

    setDebounceTimeout(timeout);
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setFilteredPeople([]);
    setNoSuggestions(false);
    onSelected(person);
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
        />
      </div>

      {filteredPeople.length > 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSuggestionClick(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {noSuggestions && (
        <div
          className="notification is-danger is-light mt-3 is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
