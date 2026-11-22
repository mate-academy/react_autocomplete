import React, { useEffect, useState } from 'react';
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
  const [isFiltering, setIsFiltering] = useState(true);

  useEffect(() => {
    setIsFiltering(true);

    const timer = setTimeout(() => {
      const normalizedQuery = query.trim().toLowerCase();

      if (query.length > 0 && normalizedQuery === '') {
        setSuggestions([]);
        setIsFiltering(false);

        return;
      }

      const filteredPeople = people.filter(person =>
        person.name.toLowerCase().includes(normalizedQuery),
      );

      setSuggestions(filteredPeople);
      setIsFiltering(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay, people]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelected(null);
    setIsFiltering(true);
    setIsOpen(true);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  const shouldShowNoSuggestions =
    isOpen && query.trim() !== '' && !isFiltering && suggestions.length === 0;

  return (
    <div
      className={`dropdown ${isOpen && suggestions.length > 0 ? 'is-active' : ''}`}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {suggestions.map(person => (
            <div
              key={person.slug}
              className="dropdown-item"
              data-cy="suggestion-item"
              onClick={() => handleSelect(person)}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>

      {shouldShowNoSuggestions && (
        <div
          className="
            notification
            is-danger
            is-light
            mt-3 is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
