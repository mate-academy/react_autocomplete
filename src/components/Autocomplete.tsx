import React, { useEffect, useRef, useState } from 'react';
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
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const prevQuery = useRef('');

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (prevQuery.current === normalizedQuery) {
      return;
    }

    const timer = setTimeout(() => {
      prevQuery.current = normalizedQuery;

      if (!normalizedQuery) {
        setSuggestions(people);

        return;
      }

      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(normalizedQuery.toLowerCase()),
      );

      setSuggestions(filtered);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay, people]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    setIsDropdownVisible(true);

    onSelected(null);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsDropdownVisible(false);

    onSelected(person);
  };

  const handleFocus = () => {
    setIsDropdownVisible(true);

    if (!query.trim()) {
      setSuggestions(people);
    }
  };

  return (
    <>
      <div className={`dropdown ${isDropdownVisible ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            className="input"
            placeholder="Enter a part of the name"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            data-cy="search-input"
          />
        </div>

        {isDropdownVisible && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {suggestions.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(person)}
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
      </div>

      {isDropdownVisible && suggestions.length === 0 && (
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
};
