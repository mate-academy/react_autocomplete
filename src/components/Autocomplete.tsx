import React, { useEffect, useState } from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filteredPeople = people.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase()),
      );

      setSuggestions(filteredPeople);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, delay, people]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setQuery(event.target.value);
  setIsOpen(true);
  onSelected(null);
};

  const handleFocus = () => {
    setIsOpen(true);
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
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={handleFocus}
          data-cy="search-input"
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
              <div
                className="notification is-danger is-light"
                role="alert"
                data-cy="no-suggestions-message"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
