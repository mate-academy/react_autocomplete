import React, { useState, useEffect } from 'react';
import { Person } from '../types/Person';

interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  debounceTime?: number;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  debounceTime = 300,
}) => {
  const [query, setQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [lastQuery, setLastQuery] = useState('');

  useEffect(() => {
    if (query === '' && isDropdownOpen) {
      setFilteredPeople(people);
      return;
    }

    if (query === lastQuery) {
      return;
    }

    const handler = setTimeout(() => {
      setFilteredPeople(
        people.filter(person =>
          person.name.toLowerCase().includes(query.toLowerCase()),
        ),
      );
      setLastQuery(query);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [query, people, debounceTime, lastQuery, isDropdownOpen]);

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    onSelected(person);
    setIsDropdownOpen(false);

  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = event.target.value.trim();
    setQuery(event.target.value);
    if (trimmedValue === '') {
      setIsDropdownOpen(false);
      return;
    }

    setIsDropdownOpen(true);
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
          className="input"
          placeholder="Enter a part of the name"
          value={query}
          data-cy="search-input"
          onChange={handleChange}
          onFocus={() => setIsDropdownOpen(true)}
        />
      </div>
      {isDropdownOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map((person) => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                >
                  <p
                    className="has-text-link"
                    onClick={() => handleSelect(person)}
                  >
                    {person.name}
                  </p>
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
