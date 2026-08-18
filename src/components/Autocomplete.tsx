import React, { useEffect, useMemo, useState } from 'react';
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
  const [input, setInput] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setAppliedQuery(input);
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [input, delay]);

  const suggestions = useMemo(() => {
    const query = appliedQuery.trim().toLowerCase();

    if (!query) {
      return people;
    }

    return people.filter(person => person.name.toLowerCase().includes(query));
  }, [people, appliedQuery]);

  const handleFocus = () => {
    setDropdown(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    onSelected(null);
    setDropdown(true);
  };

  const handleSelect = (person: Person) => {
    setInput(person.name);
    setAppliedQuery(person.name);
    onSelected(person);
    setDropdown(false);
  };

  return (
    <>
      <div className={`dropdown ${dropdown ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={input}
            onChange={handleChange}
            onFocus={handleFocus}
          />
        </div>

        {dropdown && suggestions.length > 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {suggestions.map(person => (
                <div
                  key={`${person.name}-${person.born}-${person.died}`}
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
            </div>
          </div>
        )}
      </div>

      {dropdown && appliedQuery.trim() !== '' && suggestions.length === 0 && (
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
