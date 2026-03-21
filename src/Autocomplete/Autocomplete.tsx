import { Person } from '../types/Person';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  people: Person[];
  delay?: number;
  onSelect: (person: Person) => void;
  onQueryChange: () => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelect,
  onQueryChange,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);

  const isSelecting = useRef(false);
  const prevQuery = useRef('');
  const visiblePeople = query === '' ? people : filteredPeople;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  useEffect(() => {
    if (prevQuery.current === debouncedQuery) {
      return;
    }

    prevQuery.current = debouncedQuery;
    const normalized = debouncedQuery.trim().toLowerCase(); // <-- обрізаємо пробіли

    const result =
      normalized === '' // якщо після trim пустий рядок, показуємо всіх людей
        ? people
        : people.filter(person =>
            person.name.toLowerCase().includes(normalized),
          );

    setFilteredPeople(result);
  }, [debouncedQuery, people]);

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            if (!isSelecting.current) {
              onQueryChange();
            }

            isSelecting.current = false;
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>
      {isOpen && (
        <div className="dropdown-menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {visiblePeople.map(person => (
              <div
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => {
                  onSelect(person);
                  setQuery(person.name);
                  setIsOpen(false);
                  isSelecting.current = true;
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
            {visiblePeople.length === 0 && query !== '' && (
              <div className="dropdown-item" data-cy="no-suggestions-message">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
