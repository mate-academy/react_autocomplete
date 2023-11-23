/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
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

  const applyQuery = useCallback(
    debounce((inputQuery) => {
      setAppliedQuery(inputQuery.trim());
      setIsActiveSuggestions(true);
    }, 1000),
    [setAppliedQuery],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputQuery = event.target.value;

    setIsActiveSuggestions(false);
    setQuery(inputQuery);
    applyQuery(inputQuery);
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
          onChange={handleQueryChange}
          onFocus={() => setIsActiveSuggestions(true)}
          onBlur={() => setIsActiveSuggestions(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredSuggestions.length
            ? (
              filteredSuggestions.map(person => (
                <a
                  key={person.slug}
                  className={cn(
                    'dropdown-item',
                    {
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    },
                  )}
                  onMouseDown={() => handlePersonSelect(person)}
                >
                  {person.name}
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
