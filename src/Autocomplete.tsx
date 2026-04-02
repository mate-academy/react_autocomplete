import React, { useState, useEffect } from 'react';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

type AutocompleteProps = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelected(null);
  };

  const debouncedHandler = React.useMemo(() => {
    return debounce((input: string) => {
      const normalizedInput = input.trim();

      if (!normalizedInput) {
        setSuggestions(people);
      } else {
        const filtered = people.filter(person =>
          person.name.toLowerCase().includes(normalizedInput.toLowerCase()),
        );

        setSuggestions(filtered);
      }
    }, delay);
  }, [people, delay]);

  useEffect(() => {
    debouncedHandler(query);

    return () => {
      debouncedHandler.cancel();
    };
  }, [query, debouncedHandler]);

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {suggestions.map(person => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person.slug}
              onClick={() => {
                setQuery(person.name);
                setIsOpen(false);
                onSelected(person);
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
        {isOpen && suggestions.length === 0 && query && (
          <div
            className="notification is-danger is-light mt-3
            is-align-self-flex-start"
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </div>
    </div>
  );
};
