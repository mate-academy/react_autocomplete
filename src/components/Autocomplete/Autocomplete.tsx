import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, delay]);

  const normalizedQuery = debouncedQuery.trim().toLowerCase();

  const suggestions = useMemo(() => {
    if (!isFocused) {
      return [];
    }

    if (!normalizedQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [people, normalizedQuery, isFocused]);

  const showNoSuggestions =
    isFocused && normalizedQuery.length > 0 && suggestions.length === 0;

  const handleChange = (value: string) => {
    if (value === query) {
      return;
    }

    setQuery(value);
    onSelected(null);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setDebouncedQuery(person.name);
    onSelected(person);
    setIsFocused(false);
  };

  return (
    <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={event => handleChange(event.target.value)}
          onFocus={() => {
            setIsFocused(true);
            onSelected(null);
          }}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 100);
          }}
        />
      </div>

      {isFocused && suggestions.length > 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={() => handleSelect(person)}
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
  );
};
