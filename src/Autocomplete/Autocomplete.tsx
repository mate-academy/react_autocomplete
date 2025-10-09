import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Person } from '../types/Person';
import { useDebounce } from '../hooks/useDebounce';
import { AutocompleteProps } from './types';

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  selectedPerson,
  onSelected,
  delayMs = 300,
  placeholder = 'Enter a part of the name',
}) => {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Person[]>([]);

  const debounced = useDebounce(query, delayMs);
  const lastFilteredRef = useRef<string>('');
  const handleFocus = () => {
    setIsOpen(true);

    if (query.trim() === '') {
      setSuggestions(people);
      lastFilteredRef.current = '';
    }
  };

  const handleBlur = () => {
    window.setTimeout(() => setIsOpen(false), 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;

    setQuery(next);

    if (selectedPerson) {
      onSelected(null);
    }

    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsOpen(false);
  };

  useEffect(() => {
    if (debounced === lastFilteredRef.current) {
      return;
    }

    lastFilteredRef.current = debounced;

    const normalized = debounced.trim().toLowerCase();

    if (normalized === '') {
      setSuggestions(isOpen ? people : []);

      return;
    }

    const result = people.filter(p =>
      p.name.toLowerCase().includes(normalized),
    );

    setSuggestions(result);
  }, [debounced, isOpen, people]);

  const showNoMatches = useMemo(() => {
    const typed = debounced.trim();

    return isOpen && typed !== '' && suggestions.length === 0;
  }, [debounced, isOpen, suggestions.length]);

  return (
    <>
      <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            className="input"
            placeholder={placeholder}
            data-cy="search-input"
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete="off"
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(person => (
              <div
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={() => handleSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNoMatches && (
        <div
          className="notification is-danger is-light mt-3"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
