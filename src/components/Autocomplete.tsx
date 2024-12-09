import React, { useEffect, useState } from 'react';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';

interface AutocompleteProps {
  debounceDelay?: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  debounceDelay = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [inputValue, debounceDelay]);

  useEffect(() => {
    if (debouncedValue.trim() === '') {
      setFilteredSuggestions(peopleFromServer);
    } else {
      const normalizedValue = debouncedValue.toLocaleLowerCase();
      const filteredPeople = peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(normalizedValue),
      );

      setFilteredSuggestions(filteredPeople);
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (selectedPerson && selectedPerson.name !== inputValue) {
      setSelectedPerson(null);
      onSelected(null);
    }
  }, [inputValue, selectedPerson, onSelected]);

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setFilteredSuggestions([]);
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
          onChange={e => setInputValue(e.target.value)}
          onFocus={() => {
            if (inputValue.trim() === '') {
              setFilteredSuggestions(peopleFromServer);
            }
          }}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelect(person)}
              >
                <p
                  className={
                    person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                  }
                >
                  {person.name}
                </p>
              </div>
            ))
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
    </div>
  );
};
