import React, { useState, useEffect } from 'react';
import { Person } from './types/Person';

interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected = () => {},
  delay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [noSuggestions, setNoSuggestions] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmedInput = inputValue.trim();

      if (trimmedInput === '') {
        setSuggestions(people);
        setNoSuggestions(false);

        return;
      }

      const filteredPeople = people.filter(person =>
        person.name.toLowerCase().includes(trimmedInput.toLowerCase()),
      );

      setSuggestions(filteredPeople);
      setNoSuggestions(filteredPeople.length === 0);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [inputValue, people, delay]);

  const handlePersonSelect = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setSuggestions([]);
    onSelected(person);
  };

  // eslint-disable-next-line max-len
  const handleInputValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputValue(event.target.value);

    if (selectedPerson) {
      setSelectedPerson(null);
      onSelected(null);
    }
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputValue}
          onChange={handleInputValueChange}
          data-cy="search-input"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                onClick={() => handlePersonSelect(person)}
                data-cy="suggestion-item"
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {noSuggestions && (
        <div
          // eslint-disable-next-line max-len
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
