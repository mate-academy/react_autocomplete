import React, { useEffect, useRef, useState } from 'react';
import { Person } from '../types/Person';

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
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const lastRefQuery = useRef('');

  useEffect(() => {
    if (query === lastRefQuery.current) {
      return;
    }

    const handler = setTimeout(() => {
      const normalizedQuery = query.toLowerCase();

      setFilteredPeople(
        query
          ? people.filter(person =>
              person.name.toLowerCase().includes(normalizedQuery),
            )
          : people,
      );
      lastRefQuery.current = query;
    }, delay);

    return () => clearTimeout(handler);
  }, [query, people, delay]);

  const peopleToShow = query === '' ? people : filteredPeople;

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          value={query}
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onChange={event => {
            setQuery(event.target.value);
            setIsOpen(true);
            if (event.target.value !== lastRefQuery.current) {
              onSelected(null);
            }
          }}
          onFocus={() => {
            setIsOpen(true);
            if (query === '') {
              setFilteredPeople(people);
            }
          }}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {peopleToShow.map(person => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person.slug}
              onClick={() => {
                setQuery(person.name);
                setIsOpen(false);
                lastRefQuery.current = person.name;
                setFilteredPeople([]);
                onSelected(person);
              }}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>

        {peopleToShow.length === 0 && isOpen && (
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
    </div>
  );
};
