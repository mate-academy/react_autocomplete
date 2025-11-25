import React, { useCallback, useEffect, useState } from 'react';
import { Person } from '../types/Person';

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
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [lastQuery, setLastQuery] = useState<string | null>(null);

  const getFilteredSuggestions = useCallback(
    (value: string): Person[] => {
      const trimmed = value.trim();

      if (!trimmed) {
        return people;
      }

      const lowerCaseValue = trimmed.toLowerCase();

      return people.filter(person =>
        person.name.toLowerCase().includes(lowerCaseValue),
      );
    },
    [people],
  );

  useEffect(() => {
    if (query === lastQuery) {
      return;
    }

    const handler = setTimeout(() => {
      setSuggestions(getFilteredSuggestions(query));
      setLastQuery(query);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, delay, getFilteredSuggestions, lastQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    onSelected(null);
  };

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsDropdownActive(false);
  };

  const showSuggestions = isDropdownActive && suggestions.length > 0;
  const showNoSuggestions =
    isDropdownActive && suggestions.length === 0 && query.trim() !== '';

  return (
    <div className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setIsDropdownActive(true);
            setSuggestions(getFilteredSuggestions(query));
          }}
          onBlur={() => setIsDropdownActive(false)}
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
        />
      </div>

      {isDropdownActive && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {showSuggestions &&
              suggestions.map(person => (
                <a
                  key={person.slug}
                  href="#"
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={() => handleSuggestionClick(person)}
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

            {showNoSuggestions && (
              <div className="dropdown-item" data-cy="no-suggestions-message">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
