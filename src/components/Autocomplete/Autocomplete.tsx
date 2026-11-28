import React, { useState, useRef, useMemo } from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');
  const timerId = useRef(0);

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [people, appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelected(null);
    window.clearTimeout(timerId.current);
    timerId.current = window.setTimeout(() => {
      setAppliedQuery(event.target.value.trim());
    }, delay);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSelect = (person: Person) => {
    onSelected(person);
    setIsFocused(false);
    setQuery(person.name);
  };

  return (
    <>
      <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            className="input"
            placeholder="Enter a part of the name"
            data-cy="search-input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <a
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={() => handleSelect(person)}
              >
                <p
                  className={`has-text-${person.sex === 'm' ? 'link' : 'danger'}`}
                >
                  {person.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
      {filteredPeople.length === 0 && appliedQuery !== '' && (
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
