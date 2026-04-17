import React, { useEffect, useRef, useState } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

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
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>(people);
  const prevQuery = useRef('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (prevQuery.current === query) {
        return;
      }

      prevQuery.current = query;

      if (!query.trim()) {
        setSuggestions(people);

        return;
      }

      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase()),
      );

      setSuggestions(filtered);
    }, delay);

    return () => clearTimeout(timeout);
  }, [query, delay, people]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    onSelected(null);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className={classNames('dropdown', { 'is-active': isOpen })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={handleFocus}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {suggestions.map((human: Person) => (
            <div
              key={human.slug}
              className="dropdown-item"
              data-cy="suggestion-item"
              onMouseDown={() => {
                setQuery(human.name);
                setIsOpen(false);
                onSelected(human);
              }}
            >
              <p className="has-text-link">{human.name}</p>
            </div>
          ))}
        </div>
      </div>

      {query.trim() && suggestions.length === 0 && (
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
