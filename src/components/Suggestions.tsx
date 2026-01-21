import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
type Props = {
  query: string;
  people: Person[];
  delay?: number;
  onQueryChange: (value: string) => void;
  onSelect: (person: Person) => void;
};

export const Suggestions: React.FC<Props> = ({
  query,
  people,
  delay = 300,
  onQueryChange,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const debounced = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  useEffect(() => () => debounced.cancel(), [debounced]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    onQueryChange(value);
    debounced(value.trim());
  };

  const handleSelect = (person: Person) => {
    onSelect(person);
    setIsOpen(false); // ✅ закриваємо список
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person => person.name.includes(appliedQuery));
  }, [appliedQuery, people]);

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            onChange={handleChange}
          />
        </div>
        {isOpen && (
          <div className="dropdown-menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.slug}
                  data-cy="suggestion-item"
                  className="dropdown-item"
                  onMouseDown={() => handleSelect(person)}
                >
                  {person.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {appliedQuery && filteredPeople.length === 0 && (
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
