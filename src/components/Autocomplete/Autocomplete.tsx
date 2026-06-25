import React, { useEffect, useState } from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
  onChange: () => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelect,
  onChange,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [visiblePeople, setVisiblePeople] = useState(people);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  useEffect(() => {
    if (query.trim() === '') {
      setVisiblePeople(people);

      return;
    }

    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return;
    }

    setVisiblePeople(
      people.filter(person =>
        person.name.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [debouncedQuery, query, people]);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputChange = (
    changeEvent: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newQuery = changeEvent.target.value;

    if (newQuery.trim() === '') {
      setQuery('');
      setDebouncedQuery('');
      setVisiblePeople(people);
      onChange();
      setIsOpen(true);

      return;
    }

    setQuery(newQuery);
    onChange();
    setIsOpen(true);
  };

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    onSelect(person);
    setIsOpen(false);
  };

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onFocus={handleInputFocus}
          onChange={handleInputChange}
        />
      </div>

      <div
        className="dropdown-menu"
        role="menu"
        data-cy="suggestions-list"
      >
        <div className="dropdown-content">
          {visiblePeople.map(person => (
            <div
              key={person.slug}
              className="dropdown-item"
              data-cy="suggestion-item"
              onClick={() => handleSuggestionClick(person)}
            >
              <p
                className={
                  person.sex === 'm'
                    ? 'has-text-link'
                    : 'has-text-danger'
                }
              >
                {person.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {visiblePeople.length === 0 && debouncedQuery.trim() !== '' && (
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
          <p className="has-text-danger">
            No matching suggestions
          </p>
        </div>
      )}
    </div>
  );
};
