import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

interface AutocompleteProps {
  people: Person[];
  delay: number;
  onSelected: (person: Person | null) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
) {
  let timerId: number;

  return (...args: Parameters<T>) => {
    clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const Autocomplete = ({
  people,
  delay = 300,
  onSelected,
}: AutocompleteProps) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const filterPeople = useMemo(() => {
    if (!appliedQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, people]);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const updateQuery = (value: string) => {
    setQuery(value);
    applyQuery(value);

    if (value === '') {
      onSelected(null);
    } else if (value !== appliedQuery) {
      onSelected(null);
    }
  };

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': filterPeople.length > 0 && isFocused,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={event => {
              updateQuery(event.target.value);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filterPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
              >
                <p
                  className="has-text-link"
                  onClick={() => {
                    onSelected(person);
                    updateQuery(person.name);
                  }}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filterPeople.length === 0 && (
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
          <p className="has-text-danger">No matching suggestions, hopefully</p>
        </div>
      )}
    </>
  );
};
