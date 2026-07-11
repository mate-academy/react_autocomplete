import React, { useState, useRef, useMemo } from 'react';
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

  const [isFocused, setIsFocused] = useState(false);

  const timerId = useRef(0);
  const blurTimerId = useRef(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;

    setQuery(newText);

    onSelected(null);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      const normalized = newText.trim().toLowerCase();

      if (normalized === '') {
        setDebouncedQuery('');

        return;
      }

      setDebouncedQuery(prev => {
        if (normalized === prev) {
          return prev;
        }

        return normalized;
      });
    }, delay);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsFocused(false);
  };

  const filteredPeople = useMemo(() => {
    if (!debouncedQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(debouncedQuery),
    );
  }, [debouncedQuery, people]);

  const hasNoResults = debouncedQuery.length > 0 && filteredPeople.length === 0;

  return (
    <>
      <div
        className={`dropdown ${isFocused && !hasNoResults ? 'is-active' : ''}`}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              window.clearTimeout(blurTimerId.current);
              setIsFocused(true);
            }}
            onBlur={() => {
              blurTimerId.current = window.setTimeout(
                () => setIsFocused(false),
                200,
              );
            }}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelect(person)}
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
      </div>

      {isFocused && hasNoResults && (
        <div
          className={
            'notification is-danger is-light mt-3 ' + 'is-align-self-flex-start'
          }
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
