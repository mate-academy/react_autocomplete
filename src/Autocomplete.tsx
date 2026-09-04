import React, { useEffect, useState } from 'react';
import { Person } from './types/Person';
// import { event } from 'cypress/types/jquery';

export interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, delay]);

  let filteredPeople = people;

  if (debouncedQuery.trim() !== '') {
    const lowerCaseQuery = debouncedQuery.toLowerCase();

    filteredPeople = people.filter(person =>
      person.name.toLowerCase().includes(lowerCaseQuery),
    );
  } else if (query.trim() !== '') {
    const lowerCaseQuery = query.toLowerCase();

    filteredPeople = people.filter(person =>
      person.name.toLowerCase().includes(lowerCaseQuery),
    );
  }

  return (
    <>
      <div className={`dropdown ${isActive ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              onSelected(null);
            }}
            onFocus={() => setIsActive(true)}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                onClick={() => {
                  setQuery(person.name);
                  setIsActive(false);
                  onSelected(person);
                }}
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredPeople.length === 0 && query.trim() !== '' && (
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
