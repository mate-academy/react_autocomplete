import React, { useState, useEffect, useMemo } from 'react';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  onInputChange?: (value: string) => void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  onInputChange,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [query, delay]);

  const filteredPeople = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return people;
    }

    return people.filter((person) =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [people, debouncedQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setQuery(newValue);
    setIsOpen(true);

    if (onInputChange) {
      onInputChange(newValue);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSelectPerson = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsOpen(false);
  };

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          data-cy="search-input"
        />
      </div>

      {isOpen && (
        <>
          {filteredPeople.length > 0 ? (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map((person) => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleSelectPerson(person)}
                    style={{ cursor: 'pointer' }}
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
          ) : (
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
      )}
    </div>
  );
};
