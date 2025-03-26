import React, { useState, useEffect } from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  debounceDelay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  debounceDelay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  // Debounce
  /* eslint-disable @typescript-eslint/indent */
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query !== lastQuery) {
        setLastQuery(query);

        const trimmedQuery = query.trim().toLowerCase();
        const filtered = trimmedQuery
          ? people.filter(person =>
              person.name.toLowerCase().includes(trimmedQuery),
            )
          : people;

        setFilteredPeople(filtered);
      }
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [query, people, debounceDelay, lastQuery]);

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setDropdownVisible(false);
    onSelected(person);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setDropdownVisible(true);
    onSelected(null);
  };

  return (
    <div className={`dropdown ${isDropdownVisible ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setDropdownVisible(true)}
          data-cy="search-input"
        />
      </div>

      {isDropdownVisible && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
              <div
                className="dropdown-item has-text-danger"
                data-cy="no-suggestions-message"
              >
                No matching suggestions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
