import React, { useEffect, useMemo, useState } from 'react';
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
  const [appliedQuery, setAppliedQuery] = useState(query);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query === appliedQuery) {
      return;
    }

    const handler = setTimeout(() => {
      setAppliedQuery(query);
    }, delay);

    return () => clearTimeout(handler);
  }, [query, delay]);

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase()),
    );
  }, [appliedQuery, people]);

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
            onChange={event => {
              const value = event.target.value;

              setQuery(value);
              onSelected(null);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          />
        </div>

        {isOpen && filteredPeople.length > 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => {
                    onSelected(person);
                    setQuery(person.name);
                    setAppliedQuery(person.name);
                    setIsOpen(false);
                  }}
                >
                  <p
                    className={
                      person.sex === 'f' ? 'has-text-danger' : 'has-text-link'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isOpen && appliedQuery && filteredPeople.length === 0 && (
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
