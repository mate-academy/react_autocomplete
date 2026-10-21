import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Person } from '../../types/Person';
import classNames from 'classnames';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Dropdown = React.memo(
  ({ people, delay = 300, onSelected }: Props) => {
    const input = useRef<HTMLInputElement | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState('');
    const [normalizedQuery, setNormalizedQuery] = useState('');

    useEffect(() => input.current?.focus(), []);

    const timerId = useRef(0);

    function saveQuery(newQuery: string) {
      setQuery(newQuery);
      onSelected(null);

      const trimmedQuery = newQuery.trim();

      window.clearTimeout(timerId.current);

      timerId.current = window.setTimeout(() => {
        if (trimmedQuery.length > 0) {
          setNormalizedQuery(trimmedQuery.toLowerCase());
        }
      }, delay);
    }

    const filteredPeople = useMemo(() => {
      if (query.length === 0) {
        return people;
      }

      if (query.trim().length === 0) {
        return [];
      }

      return people.filter(person =>
        person.name.toLowerCase().includes(normalizedQuery),
      );
    }, [normalizedQuery, query, people]);

    const handleSelected = (person: Person) => {
      setQuery(person.name);
      window.clearTimeout(timerId.current);
      setNormalizedQuery(person.name.trim().toLowerCase());
      onSelected(person);
      input.current?.blur();
    };

    return (
      <div className={classNames('dropdown', { 'is-active': isFocused })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            ref={input}
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={event => saveQuery(event.target.value)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {filteredPeople.length === 0 ? (
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
          ) : (
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  style={{ cursor: 'pointer' }}
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => handleSelected(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);

Dropdown.displayName = 'Dropdown';
