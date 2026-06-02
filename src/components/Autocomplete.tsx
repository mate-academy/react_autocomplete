import React, { useEffect, useState } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';
import { useMemo } from 'react';

type Props = {
  people: Person[]; //це не знаю чи правильно
  onSelected: (person: Person) => void;
  onClear: () => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  onClear,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [people, debouncedQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isFocused && isDropped,
      })}
    >
      <div className="dropdown-trigger">
        <input
          data-cy="search-input"
          className="input"
          placeholder="Enter a part of the name"
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            onClear();
          }}
          onFocus={() => {
            setIsFocused(true);
            setIsDropped(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setIsDropped(false);
          }}
        />
      </div>
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person.slug}
              onMouseDown={() => {
                setQuery(person.name);
                setIsDropped(false);
                onSelected(person);
              }}
            >
              {' '}
              {person.sex === 'f' ? (
                <p className="has-text-danger">{person.name}</p>
              ) : (
                <p className="has-text-link">{person.name}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      {filteredPeople.length === 0 && query !== '' && (
        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
            "
          data-cy="no-suggestions-message"
        >
          No matching suggestions
        </div>
      )}
    </div>
  );
};
