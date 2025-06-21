import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<Person[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [prevQuery, setPrevQuery] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    setIsDropdownOpen(true);

    if (selectedPerson && value !== selectedPerson.name) {
      onSelected(null);
    }
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    onSelected(person);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (query === '') {
        setFiltered(people);
        setPrevQuery('');

        return;
      }

      if (query === prevQuery) {
        return;
      }

      const lower = query.toLowerCase();

      const result = people.filter(p => p.name.toLowerCase().includes(lower));

      setFiltered(result);
      setPrevQuery(query);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, people, delay]);

  const hasSuggestions = filtered.length > 0;

  return (
    <div className={classNames('dropdown', { 'is-active': isDropdownOpen })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleInput}
          onFocus={() => {
            setIsDropdownOpen(true);
            if (query === '') {
              setFiltered(people);
            }
          }}
        />
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {hasSuggestions ? (
              filtered.map(person => (
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
