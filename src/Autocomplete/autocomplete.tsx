import React, { useEffect, useState } from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete = ({ people, delay, onSelected }: Props) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(people);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);
    onSelected(null);

    setIsDropdownOpen(true);
  };

  useEffect(() => {
    const delayMs = delay ?? 300;

    if (query.trim() === '') {
      setSuggestions(people);

      return;
    }

    const timerId = setTimeout(() => {
      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase()),
      );

      setSuggestions(filtered);
    }, delayMs);

    return () => {
      clearTimeout(timerId);
    };
  }, [query, people, delay]);

  const handleFocus = () => setIsDropdownOpen(true);
  const handleBlur = () => setIsDropdownOpen(false);

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <div
        className="dropdown-menu"
        role="menu"
        data-cy="suggestions-list"
        onMouseDown={event => event.preventDefault()}
      >
        <div className="dropdown-content">
          {suggestions.length > 0 &&
            suggestions.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onClick={() => handleSuggestionClick(person)}
                role="button"
                style={{ cursor: 'pointer' }}
              >
                <p
                  className={
                    person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                  }
                >
                  {person.name}
                </p>
              </div>
            ))}
          {suggestions.length === 0 && query.trim() !== '' && (
            <div className="dropdown-item" data-cy="no-suggestions-message">
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
