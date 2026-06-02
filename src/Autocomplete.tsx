import React, { useEffect, useState, useRef } from 'react';
import { Person } from './types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person) => void;
  onQueryChange: () => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
  onQueryChange,
}) => {
  const [query, setQuery] = useState('');
  const [visiblePeople, setVisiblePeople] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const lastQuery = useRef('');

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery === '' || query === lastQuery.current) {
      setVisiblePeople([]);

      return;
    }

    const timer = setTimeout(() => {
      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(trimmedQuery.toLowerCase()),
      );

      setVisiblePeople(filtered);
      lastQuery.current = query;
    }, delay);

    return () => clearTimeout(timer);
  }, [query, people, delay]);

  const handleChange = (value: string) => {
    setQuery(value);
    setIsOpen(true);
    onQueryChange();
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
          onFocus={() => {
            setIsOpen(true);

            // показати всіх якщо пусто
            if (!query.trim()) {
              setVisiblePeople(people);
            }
          }}
          onChange={e => handleChange(e.target.value)}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {visiblePeople.length > 0 ? (
              visiblePeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => {
                    setQuery(person.name);
                    setIsOpen(false);
                    onSelected(person);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
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
