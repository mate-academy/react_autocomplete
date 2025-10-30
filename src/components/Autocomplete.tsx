import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

interface AutocompleteProps {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const lastQueryRef = useRef('');

  const timeoutRef = useRef<number>();

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();

    if (trimmed === lastQueryRef.current) {
      return;
    }

    setLoading(true);
    window.clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      const normalized = query.toLowerCase().trim();
      const results = normalized
        ? people.filter(man => man.name.toLowerCase().includes(normalized))
        : people;

      setFiltered(results);
      setIsOpen(true);
      lastQueryRef.current = normalized;
      setLoading(false);
    }, delay);

    return () => window.clearTimeout(timeoutRef.current);
  }, [query, delay, people]);

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  const handleFocus = () => {
    if (!query.trim()) {
      setFiltered(people);
      setIsOpen(true);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    setIsOpen(true);
    onSelected(null);
  };

  const noResults = !loading && filtered.length === 0 && isOpen;

  return (
    <div className={classNames('dropdown', { 'is-active': isOpen })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          value={query}
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filtered.map(person => (
              <div
                key={person.name}
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

            {noResults && (
              <div
                className="notification is-danger is-light mt-2"
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
