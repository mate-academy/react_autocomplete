import React, { useMemo, useRef, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
  selectedPerson: Person | null;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
  selectedPerson,
}) => {
  const [query, setQuery] = useState('');
  const [normalizedQuery, setNormalizedQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const timerId = useRef(0);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);

    window.clearTimeout(timerId.current);

    if (selectedPerson && value !== selectedPerson.name) {
      onSelected(null);
    }

    timerId.current = window.setTimeout(() => {
      const trimmedValue = value.trim();

      if (trimmedValue === '') {
        setNormalizedQuery('');
      } else {
        setNormalizedQuery(trimmedValue);
      }
    }, delay);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person => person.name.includes(normalizedQuery));
  }, [normalizedQuery, people]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setFocused(true)}
        />
      </div>

      {focused && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.length !== 0 ? (
              filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => {
                    setQuery(person.name);
                    setNormalizedQuery(person.name);
                    onSelected(person);
                    setFocused(false);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
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
          </div>
        </div>
      )}
    </div>
  );
};
