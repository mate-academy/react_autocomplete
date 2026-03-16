import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

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
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const lastProcessedQuery = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      if (lastProcessedQuery.current === normalizedQuery) {
        return;
      }

      lastProcessedQuery.current = normalizedQuery;

      if (!normalizedQuery) {
        setSuggestions(people);
        return;
      }

      const filteredPeople = people.filter(person =>
        person.name.toLowerCase().includes(normalizedQuery),
      );

      setSuggestions(filteredPeople);
    }, delay);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [normalizedQuery, people, delay, isOpen]);

  const handleFocus = () => {
    setIsOpen(true);

    if (!query.trim()) {
      setSuggestions(people);
      lastProcessedQuery.current = '';
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);
    setIsOpen(true);
    onSelected(null);

    if (!newQuery.trim()) {
      setSuggestions(people);
      lastProcessedQuery.current = '';
    }
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    setSuggestions([]);
    lastProcessedQuery.current = person.name.trim().toLowerCase();
    onSelected(person);
  };

  const showSuggestions = isOpen && suggestions.length > 0;
  const showNoSuggestions =
    isOpen && normalizedQuery.length > 0 && suggestions.length === 0;

  return (
    <div className={classNames('dropdown', { 'is-active': isOpen })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => {
            window.setTimeout(() => {
              setIsOpen(false);
            }, 150);
          }}
        />
      </div>

      {showSuggestions && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={event => {
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
              </div>
            ))}
          </div>
        </div>
      )}

      {showNoSuggestions && (
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
