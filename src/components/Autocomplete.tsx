import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
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
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    setFilteredPeople([]);
    onSelected(person);
  };

  useEffect(() => {
    if (query === lastQuery) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const lowerQuery = query.trim().toLowerCase();

      if (lowerQuery === '') {
        setFilteredPeople(people);
      } else {
        setFilteredPeople(
          people.filter(person =>
            person.name.toLowerCase().includes(lowerQuery),
          ),
        );
      }

      setIsOpen(true);
      setLastQuery(query);
      onSelected(null);
    }, delay);
  }, [query, delay, lastQuery, people, onSelected]);

  const handleFocus = () => {
    if (query.trim() === '') {
      setFilteredPeople(people);
    }

    setIsOpen(true);
  };

  return (
    <div className={classNames('dropdown', { 'is-active': isOpen })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          className="input"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder="Enter a part of the name"
          data-cy="search-input"
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content" data-cy="suggestions-list">
          {query !== '' && filteredPeople.length === 0 ? (
            <div
              className="dropdown-item has-text-danger"
              data-cy="no-suggestions-message"
            >
              No matching suggestions
            </div>
          ) : (
            filteredPeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                onClick={() => handleSelect(person)}
                data-cy="suggestion-item"
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
