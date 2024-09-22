import React, { useState, useEffect } from 'react';
import { Person } from './types/Person';
import { useDebounce } from 'use-debounce';

interface AutocompleteProps {
  people: Person[];
  onSelect: (person: Person) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ people, onSelect }) => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue] = useDebounce(inputValue, 300);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);

  useEffect(() => {
    if (!debouncedValue) {
      setFilteredPeople(people);

      return;
    }

    const filtered = people.filter(person =>
      person.name.toLowerCase().includes(debouncedValue.toLowerCase()),
    );

    setFilteredPeople(filtered);
  }, [debouncedValue, people]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    onSelect(person);
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

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.length > 0 ? (
            filteredPeople.map(person => (
              <div
                key={person.slug}
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
    </div>
  );
};

export default Autocomplete;
