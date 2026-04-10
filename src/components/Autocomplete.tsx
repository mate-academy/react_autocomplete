import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery === '') {
      setDebouncedQuery('');

      return undefined;
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(normalizedQuery);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, delay]);

  const filteredPeople = useMemo(() => {
    if (query.trim() === '') {
      return people;
    }

    if (debouncedQuery === '') {
      return [];
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [people, query, debouncedQuery]);

  const showNoSuggestions =
    isOpen &&
    query.trim() !== '' &&
    debouncedQuery !== '' &&
    filteredPeople.length === 0;

  return (
    <>
      <div className={isOpen ? 'dropdown is-active' : 'dropdown'}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            data-qa="search-input"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={event => {
              setQuery(event.target.value);
              onSelected(null);
              setIsOpen(true);
            }}
          />
        </div>

        <div
          className="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
          data-qa="suggestions-list"
        >
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                data-qa="suggestion-item"
                key={person.slug}
                onMouseDown={() => {
                  setQuery(person.name);
                  setDebouncedQuery(person.name);
                  onSelected(person);
                  setIsOpen(false);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
          data-qa="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
