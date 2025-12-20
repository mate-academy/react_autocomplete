import React, { useEffect, useRef, useState } from 'react';
import { Person } from './types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const Dropdown: React.FC<Props> = ({ people, onSelected, delay }) => {
  const [query, setQuery] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState(people);

  const lastQueryRef = useRef('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query === lastQueryRef.current) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const normalizedQuery = query.trim().toLowerCase();

      const result = people.filter(person =>
        person.name.toLowerCase().includes(normalizedQuery),
      );

      setFilteredPeople(result);
      lastQueryRef.current = query;
    }, delay ?? 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, people, delay]);

  return (
    <div className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}>
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
          onFocus={() => setIsDropdownActive(true)}
          onBlur={() => setIsDropdownActive(false)}
        />
      </div>

      {isDropdownActive && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={() => {
                  setQuery(person.name);
                  onSelected(person);
                  setIsDropdownActive(false);
                }}
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

          {query && filteredPeople.length === 0 && (
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
      )}
    </div>
  );
};
