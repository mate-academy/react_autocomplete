import { useState, useRef, useMemo } from 'react';
import { DropdownItem } from './DropdownItem';
import { Person } from './types/Person';
import React from 'react';

type Props = {
  people: Person[];
  delay?: number;
  onSelect: (person: Person | null) => void;
};

export const Dropdown: React.FC<Props> = ({
  people,
  delay = 300,
  onSelect: handleChange,
}: Props) => {
  const [query, setQuery] = useState('');
  const [normalizedQuery, setNormalizedQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const timerId = useRef(0);

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, people]);

  const saveQuery = (newQuery: string) => {
    setQuery(newQuery);
    handleChange(null);

    window.clearTimeout(timerId.current);

    if (newQuery.trim().length === 0) {
      setNormalizedQuery('');
    } else {
      timerId.current = window.setTimeout(() => {
        const latestQuery = newQuery.trim().toLowerCase();

        if (latestQuery !== normalizedQuery) {
          setNormalizedQuery(latestQuery);
        }
      }, delay);
    }
  };

  return (
    <>
      <div className={isDropdownOpen ? 'dropdown is-active' : 'dropdown'}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={event => saveQuery(event.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
          />
        </div>

        {filteredPeople.length > 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople?.map(person => (
                <DropdownItem
                  key={person.slug}
                  person={person}
                  onSelect={(selectedPerson: Person) => {
                    handleChange(selectedPerson);
                    setQuery(selectedPerson.name);
                    setIsDropdownOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {isDropdownOpen && filteredPeople.length === 0 && (
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
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
