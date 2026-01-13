import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Person } from '../types/Person';

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
  const timerId = useRef<number>(0);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    timerId.current = window.setTimeout(() => {
      const trimmedQuery = query.trim();

      if (trimmedQuery !== appliedQuery) {
        setAppliedQuery(trimmedQuery);
      }
    }, delay);

    return () => {
      clearTimeout(timerId.current);
    };
  }, [query, delay, appliedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setIsOpen(true);
    onSelected(null);
  };

  const handleSelectedPerson = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    onSelected(person);
    setIsOpen(false);
  };

  const filteredPeople = useMemo(() => {
    const lowerCaseQuery = appliedQuery.trim().toLowerCase();

    return people.filter(person =>
      person.name.toLowerCase().includes(lowerCaseQuery),
    );
  }, [people, appliedQuery]);

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`} ref={dropdownRef}>
      <div className="dropdown-trigger">
        <input
          type="text"
          className="input"
          data-cy="search-input"
          value={query}
          placeholder="Enter a part of the name"
          onChange={handleQueryChange}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <div
              key={person.slug}
              className="dropdown-item"
              data-cy="suggestion-item"
              onMouseDown={() => {
                handleSelectedPerson(person);
              }}
            >
              <p className="has-text-link" style={{ cursor: 'pointer' }}>
                {person.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {appliedQuery && filteredPeople.length === 0 && (
        <div
          className="notification is-danger is-light mt-3"
          data-cy="no-suggestions-message"
        >
          No matching suggestions
        </div>
      )}
    </div>
  );
};
