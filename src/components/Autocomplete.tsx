import React, { useEffect, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery === lastQuery) {
      return;
    }

    const timeoutId = setTimeout(() => {
      let filtered: Person[];

      if (trimmedQuery) {
        filtered = people.filter(person =>
          person.name.toLowerCase().includes(trimmedQuery.toLowerCase()),
        );
      } else {
        filtered = people;
      }

      setSuggestions(filtered);
      setLastQuery(trimmedQuery);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, delay, people, lastQuery]);

  const handleFocus = () => {
    setIsOpen(true);
    if (!query) {
      setSuggestions(people);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    onSelected(null);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          className="input"
          placeholder="Enter a part of the name"
          value={query}
          data-cy="search-input"
          onFocus={handleFocus}
          onChange={handleChange}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.length === 0 ? (
              <div
                className="dropdown-item has-text-danger"
                data-cy="no-suggestions-message"
              >
                No matching suggestions
              </div>
            ) : (
              suggestions.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
