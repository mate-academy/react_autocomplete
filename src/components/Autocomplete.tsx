import React, { useState, useEffect } from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  useEffect(() => {
    if (query.length > 0 && query.trim() === '') {
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(handler);
  }, [query, delay]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setIsDropdownActive(true);
    onSelected(null);
  };

  const handleInputFocus = () => {
    setIsDropdownActive(true);
    setDebouncedQuery(query);
  };

  const handleInputBlur = () => {
    setIsDropdownActive(false);
  };

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    setDebouncedQuery(person.name);
    setIsDropdownActive(false);
    onSelected(person);
  };

  let suggestions: Person[] = [];

  if (query.length > 0 && query.trim() === '') {
    suggestions = [];
  } else {
    const currentSearch =
      isDropdownActive && debouncedQuery !== query ? query : debouncedQuery;
    const normalizedQuery = currentSearch.trim().toLowerCase();

    if (normalizedQuery === '') {
      suggestions = people;
    } else {
      suggestions = people.filter(person =>
        person.name.toLowerCase().includes(normalizedQuery),
      );
    }
  }

  const showSuggestions = isDropdownActive && suggestions.length > 0;
  const showNoSuggestions =
    isDropdownActive && query.trim().length > 0 && suggestions.length === 0;

  return (
    <div className={`dropdown ${showSuggestions ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>

      {showSuggestions && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={e => {
                  e.preventDefault();
                  handleSuggestionClick(person);
                }}
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
          </div>
        </div>
      )}

      {showNoSuggestions && (
        <div
          className="notification is-danger is-light
          mt-3 is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
