import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const AutoComplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number>(0);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    onSelected(null);

    window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      setAppliedQuery(event.target.value);
    }, delay);
  };

  const filteredPeople = useMemo(() => {
    if (appliedQuery.trim().length > 0) {
      return people.filter(person =>
        person.name
          .toLowerCase()
          .trim()
          .includes(appliedQuery.toLowerCase().trim()),
      );
    }

    return people;
  }, [appliedQuery, people]);

  return (
    <>
      <div className={`dropdown ${isDropDownOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            ref={inputRef}
            placeholder="Enter a part of the name"
            value={query}
            onChange={handleSearch}
            className="input"
            data-cy="search-input"
            onFocus={() => setIsDropDownOpen(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                className="dropdown-item"
                key={person.slug}
                data-cy="suggestion-item"
                onClick={() => {
                  onSelected(person);
                  setQuery(person.name);
                  setIsDropDownOpen(false);
                }}
              >
                <p
                  className={
                    person.sex === 'm' ? 'has-text-info' : 'has-text-danger'
                  }
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredPeople.length === 0 && (
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
