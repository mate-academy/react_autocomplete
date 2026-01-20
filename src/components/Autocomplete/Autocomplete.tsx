import React, { useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  items: Person[];
  onSelect: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  items,
  onSelect,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const blurTimeout = useRef<number | null>(null);

  const applyQueryDebounced = useMemo(
    () =>
      debounce((newQuery: string) => {
        setAppliedQuery(newQuery);
      }, delay),
    [delay],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQueryDebounced(event.target.value);

    onSelect(null);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    onSelect(person);
    setIsFocused(false);
  };

  const handleFocus = () => {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
      blurTimeout.current = null;
    }

    setIsFocused(true);
  };

  const handleBlur = () => {
    blurTimeout.current = window.setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const filteredItems = useMemo(() => {
    const normalizedQuery = appliedQuery.toLowerCase().trim();

    if (appliedQuery.length > 0 && normalizedQuery.length === 0) {
      return [];
    }

    return items.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [items, appliedQuery]);

  return (
    <div className={classNames('dropdown', { 'is-active': isFocused })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          className="input"
          placeholder="Enter a part of the name"
          data-cy="search-input"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredItems.map(person => (
            <a
              href="#"
              key={person.slug}
              className="dropdown-item"
              data-cy="suggestion-item"
              onClick={event => {
                event.preventDefault();
                handleSelect(person);
              }}
            >
              <p
                className={
                  person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                }
              >
                {person.name}
              </p>
            </a>
          ))}

          {filteredItems.length === 0 && (
            <div className="dropdown-item" data-cy="no-suggestions-message">
              No matching suggestions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
