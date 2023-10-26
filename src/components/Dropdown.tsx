/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

interface Props {
  persons: Person[];
  onSelect: (person: Person) => void;
}

export const Dropdown: React.FC<Props> = ({ persons, onSelect }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState(query);
  const [isActiveSuggestions, setIsActiveSuggestions] = useState(false);

  const handlePersonSelect = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    onSelect(person);
  };

  const handleQuery = (inputQuery: string, delay: number) => {
    if (isActiveSuggestions) {
      setIsActiveSuggestions(false);
    }

    setQuery(inputQuery);
    setAppliedQuery(inputQuery);

    setTimeout(() => {
      setIsActiveSuggestions(true);
    }, delay);
  };

  const filteredSuggestions = useMemo(() => {
    return persons.filter(person => {
      const name = person.name.toLowerCase();
      const lowerQuery = appliedQuery.toLowerCase().trim();

      return name.includes(lowerQuery);
    });
  }, [appliedQuery, persons]);

  return (
    <div className={cn(
      'dropdown',
      { 'is-active': isActiveSuggestions },
    )}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={(event) => handleQuery(event.target.value, 1000)}
          onFocus={() => setIsActiveSuggestions(true)}
          onBlur={() => setIsActiveSuggestions(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredSuggestions.length
            ? (
              filteredSuggestions.map(human => (
                <a
                  key={human.slug}
                  className={cn(
                    'dropdown-item',
                    {
                      'has-text-link': human.sex === 'm',
                      'has-text-danger': human.sex === 'f',
                    },
                  )}
                  onMouseDown={() => handlePersonSelect(human)}
                >
                  {human.name}
                </a>
              ))
            )
            : (
              <div className="dropdown-item">
                <p>
                  No matching suggestions
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
