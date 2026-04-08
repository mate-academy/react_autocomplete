import React, { useState, useMemo } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';

type DropdownProps = {
  people: Person[];
  onPersonSelect: (person: Person | null) => void;
  setQuery: (query: string) => void;
  delay?: number;
};

export const Dropdown: React.FC<DropdownProps> = React.memo(
  ({ people, setQuery, onPersonSelect, delay = 300 }) => {
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const debouncedSetQuery = useMemo(
      () =>
        debounce((newValue: string) => {
          setQuery(newValue);
          onPersonSelect(null);
        }, delay),
      [setQuery, onPersonSelect, delay],
    );

    return (
      <>
        <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={value}
              onChange={e => {
                setValue(e.target.value);
                debouncedSetQuery(e.target.value);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {people.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                >
                  <p
                    className="has-text-link"
                    onMouseDown={() => {
                      onPersonSelect(person);
                      setValue(person.name);
                      setQuery('');
                    }}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {people.length === 0 && (
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
  },
);

Dropdown.displayName = 'Dropdown';
