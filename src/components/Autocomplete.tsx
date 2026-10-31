import React, { useEffect, useRef, useState } from 'react';
import type { Person } from '../types/Person';

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
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const lastFilteredQuery = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      lastFilteredQuery.current = null;
      setSuggestions(people);

      return;
    }

    if (lastFilteredQuery.current === normalizedQuery) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const filteredPeople = people.filter(person =>
        person.name.toLowerCase().includes(normalizedQuery),
      );

      setSuggestions(filteredPeople);
      lastFilteredQuery.current = normalizedQuery;
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query, delay, people, isOpen]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsOpen(true);
    onSelected(null);
  };

  const handleFocus = () => {
    setIsOpen(true);

    if (!query.trim()) {
      setSuggestions(people);
    }
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setSuggestions([]);
    setIsOpen(false);
    lastFilteredQuery.current = null;
    onSelected(person);
  };

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          data-cy="search-input"
          data-qa="search-input"
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </div>

      {isOpen && (
        <div
          className="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
          data-qa="suggestions-list"
        >
          <div className="dropdown-content">
            {suggestions.map(person => (
              <button
                type="button"
                className="dropdown-item"
                key={person.slug}
                data-cy="suggestion-item"
                data-qa="suggestion-item"
                onClick={() => handleSelect(person)}
              >
                <span className="has-text-link">{person.name}</span>
              </button>
            ))}

            {query.trim() !== '' && suggestions.length === 0 && (
              <div
                className="dropdown-item"
                role="alert"
                data-cy="no-suggestions-message"
                data-qa="no-suggestions-message"
              >
                <p className="has-text-danger"> No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
