import React, { useEffect, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person) => void;
  onQueryChange: () => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  onQueryChange,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState('');

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

  const debouncedQuery = useDebounce(query, 300);

  const filteredList = people.filter((person: Person) =>
    person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

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
              {filteredList.map((person: Person, index: number) => (
                <div
                  key={index}
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

      {query && filteredList.length === 0 && (
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
