import React, { useEffect, useMemo, useState } from 'react';
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
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [query, delay]);

  const normalizedQuery = debouncedQuery.trim().toLowerCase();

  const visiblePeople = useMemo(() => {
    if (!normalizedQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [people, normalizedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);
    setIsOpen(true);
    onSelected(null);
  };

  const handlePersonSelect = (person: Person) => {
    setQuery(person.name);
    setDebouncedQuery(person.name);
    setIsOpen(false);
    onSelected(person);
  };

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
            onChange={handleQueryChange}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        <div
          className="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
        >
          <div className="dropdown-content">
            {visiblePeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onClick={() => handlePersonSelect(person)}
              >
                <p
                  className={
                    person.sex === 'm'
                      ? 'has-text-link'
                      : 'has-text-danger'
                  }
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isOpen && normalizedQuery && visiblePeople.length === 0 && (
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
