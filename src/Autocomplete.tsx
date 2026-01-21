import React, { useEffect, useState } from 'react';
import { Person } from './types/Person';
import cn from 'classnames';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isSearching, setIsSearching] = useState(true);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions(people);
      setIsSearching(false);

      return;
    }

    const timer = setTimeout(() => {
      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase().trim()),
      );

      setSuggestions(filtered);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, people, delay]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setQuery(value);
    onSelected(null);
    if (value.length > 0) {
      setIsSearching(true);
    }
  };

  const handleSelect = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setSuggestions([]);
    setIsSearching(false);
  };

  const showNoResults =
    query.length > 0 && suggestions.length === 0 && isSearching;

  return (
    <div className={cn('dropdown', { 'is-active': suggestions.length > 0 })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (!query) {
              setSuggestions(people);
            }
          }}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {suggestions.map(person => (
            <a
              key={person.slug}
              className="dropdown-item"
              data-cy="suggestion-item"
              onClick={() => handleSelect(person)}
            >
              <p
                className={cn({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </a>
          ))}
        </div>
      </div>

      {showNoResults && (
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
