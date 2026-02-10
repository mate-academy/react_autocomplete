import React, { useState, useEffect, useRef } from 'react';
import { Person } from './types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isDropdownActive, setDropdownActive] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Zamykanie po kliknięciu poza komponentem
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 2. Obsługa opóźnienia (Debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(handler);
  }, [query, delay]);

  const suggestions = people.filter(person =>
    person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    onSelected(person);
    setDropdownActive(false);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedPerson(null);
    onSelected(null);
  };

  return (
    <div
      className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}
      ref={dropdownRef}
      style={{ width: '100%' }}
    >
      <div className="dropdown-trigger">
        <div className="control has-icons-right">
          <input
            type="text"
            className="input"
            placeholder="Enter a part of the name"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              if (selectedPerson) {
                setSelectedPerson(null);
                onSelected(null);
              }
            }}
            onFocus={() => setDropdownActive(true)}
            data-cy="search-input"
          />

          {/* Przycisk "X" do kasowania */}
          {query && (
            <span
              className="icon is-right is-clickable"
              onClick={handleClear}
              style={{ pointerEvents: 'all' }}
            >
              <i className="fas fa-times"></i>{' '}
              {/* Upewnij się, że masz FontAwesome lub użyj zwykłego "x" */}
              <button className="delete is-small"></button>
            </span>
          )}
        </div>
      </div>

      <div
        className="dropdown-menu"
        id="dropdown-menu"
        role="menu"
        data-cy="suggestions-list"
      >
        <div className="dropdown-content">
          {suggestions.length > 0 ? (
            suggestions.map(person => (
              <a
                key={person.slug}
                className="dropdown-item"
                onClick={() => handleSelect(person)}
                data-cy="suggestion-item"
              >
                <span
                  className={
                    person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                  }
                >
                  {person.name}
                </span>
              </a>
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
