import React, { useState } from 'react';
import { Person } from '../types/Person';

interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const cleanQuery = debouncedQuery.trim().toLowerCase();
  const visiblePeople = cleanQuery
    ? people.filter(person => person.name.toLowerCase().includes(cleanQuery))
    : people;

  React.useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timerId);
  }, [query, delay]);

  const shouldShowNoResults =
    isOpen && cleanQuery && visiblePeople.length === 0;

  return (
    <>
      <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              onSelected(null);
            }}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {visiblePeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.id}
                onClick={() => {
                  onSelected(person);
                  setQuery(person.name);
                  setIsOpen(false);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {shouldShowNoResults && (
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
    </>
  );
};
