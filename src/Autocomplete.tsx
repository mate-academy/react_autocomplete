/* eslint-disable react-hooks/exhaustive-deps */
import cn from 'classnames';
import debounce from 'lodash.debounce';

import React, { useState, useCallback, useMemo } from 'react';
import { Person } from './types/Person';

interface Props {
  people: Person[]
  delay?: number
  onSelected: (value: Person | null) => void
}

export const Autocomplete: React.FC<Props> = ({
  people,
  delay,
  onSelected,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce((value: string) => {
    setAppliedQuery(value);
    setIsDropdownOpen(true);
  }, delay), [delay]);

  const filteredPeople = useMemo(() => {
    const normalizedQuery = appliedQuery.toLowerCase().trim();

    return people.filter(
      person => person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [appliedQuery, people]);

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDropdownOpen(false);
    setQuery(event.target.value);
    applyQuery(event.target.value);
    onSelected(null);
  };

  return (
    <div className={cn('dropdown', {
      'is-active': isDropdownOpen,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setIsDropdownOpen(false)}
          onChange={handleInputChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length >= 1 ? (
            filteredPeople.map(person => (
              <a
                className="dropdown-item"
                href="/"
                key={person.slug}
                onMouseDown={() => handleSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </a>
            ))
          ) : (
            <p>No matching suggestions</p>
          )}
        </div>
      </div>
    </div>
  );
};
