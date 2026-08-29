import React, { useEffect, useState } from 'react';
import { Person } from '../../types/Person';

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
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  let filteredPeople = people;

  if (appliedQuery.trim() !== '') {
    filteredPeople = people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase()),
    );
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAppliedQuery(query);
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query, delay]);

  return (
    <div className={`dropdown ${isFocused ? ' is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onFocus={() => {
            setIsFocused(true);
          }}
          onChange={event => {
            setQuery(event.target.value);
            onSelected(null);
          }}
        />
      </div>
      {filteredPeople.length > 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map((person: Person) => {
              return (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => {
                    onSelected(person);
                    setQuery(person.name);
                    setIsFocused(false);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {filteredPeople.length === 0 && (
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
  );
};
