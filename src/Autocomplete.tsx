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

  // 1. Obsługa opóźnienia (Debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(handler);
  }, [query, delay]);

  const trimmedQuery = query.trim(); // natychmiastowa wartość inputa

  const suggestions = React.useMemo(() => {
    // Jeśli input pusty, pokaż wszystkich od razu
    if (trimmedQuery === '') {
      return people;
    }

    // W przeciwnym razie filtruj po debouncedQuery
    return people.filter(person =>
      person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [trimmedQuery, debouncedQuery, people]);

  // 3. Wybór osoby
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
    setDropdownActive(true); // optionally reopen dropdown on clear
  };

  // 4. Obsługa zamykania dropdown po utracie fokusu
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropdownActive(false);
    }
  };

  return (
    <div
      className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}
      ref={dropdownRef}
      style={{ width: '100%' }}
      onBlur={handleBlur}
      tabIndex={-1} // needed for onBlur to fire on div
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
            data-qa="search-input"
          />

          {/* Przycisk "X" do kasowania */}
          {query && (
            <button
              className="delete is-small"
              onClick={handleClear}
              aria-label="Clear input"
              style={{
                pointerEvents: 'all',
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
              data-cy="clear-button"
              data-qa="clear-button"
            ></button>
          )}
        </div>
      </div>

      <div
        className="dropdown-menu"
        id="dropdown-menu"
        role="menu"
        data-cy="suggestions-list"
        data-qa="suggestions-list"
      >
        <div className="dropdown-content">
          {suggestions.length > 0 ? (
            suggestions.map(person => (
              <a
                key={person.slug}
                className="dropdown-item"
                onClick={() => handleSelect(person)}
                data-cy="suggestion-item"
                data-qa="suggestion-item"
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
            <div
              className="dropdown-item"
              data-cy="no-suggestions-message"
              data-qa="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
