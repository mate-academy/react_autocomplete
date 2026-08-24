import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person) => void;
  onQueryChange: () => void;
  delay: number;
};

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  onQueryChange,
  delay,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, delay);

  const filteredList = useMemo(() => {
    const searchQuery = debouncedQuery.trim().toLowerCase();

    if (searchQuery.length === 0) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(searchQuery),
    );
  }, [people, debouncedQuery]);

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsVisible(false);

    onSelected(person);
  };

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              onQueryChange();
            }}
            onFocus={() => {
              setIsVisible(true);
            }}
            onBlur={() => {
              setIsVisible(false);
            }}
          />
        </div>

        {isVisible && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredList.map((person: Person) => (
                <div
                  key={person.born}
                  onMouseDown={() => {
                    handleSelect(person);
                  }}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {debouncedQuery.trim().length > 0 && filteredList.length === 0 && (
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
