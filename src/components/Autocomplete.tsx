import React, { useEffect, useMemo, useState } from 'react';
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

  const filteredPeople = useMemo(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return people;
    }

    const lower = trimmedQuery.toLowerCase();

    return people.filter(p => p.name.toLowerCase().includes(lower));
  }, [query, people]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSuggestions(filteredPeople);
    }, delay);

    return () => clearTimeout(handler);
  }, [filteredPeople, delay]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelected(null); // сбрасываем выбранного человека
  };

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsDropdownActive(false);
  };

  const hasNoSuggestions = suggestions.length === 0 && query !== '';

  return (
    <div className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownActive(true)}
          onBlur={() => setIsDropdownActive(false)}
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
        />
      </div>

      {isDropdownActive && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {hasNoSuggestions ? (
              <div className="dropdown-item" data-cy="no-suggestions-message">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            ) : (
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
