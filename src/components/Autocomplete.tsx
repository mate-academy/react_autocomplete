import React, { useState, useMemo, useRef } from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [initialValue, setInitialValue] = useState('');
  const [query, setQuery] = useState('');
  const [boll, setBoll] = useState(false);
  const timerId = useRef(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setInitialValue(newValue);
    onSelected(null);
    setBoll(true);

    window.clearTimeout(timerId.current);
    timerId.current = window.setTimeout(() => {
      setQuery(newValue);
    }, delay);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, people]);

  return (
    <div className={`dropdown ${boll ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          className="input"
          data-cy="search-input"
          value={initialValue}
          onChange={handleInputChange}
          onFocus={() => setBoll(true)}
          placeholder="Enter a part of the name"
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <a
              key={person.slug}
              className="dropdown-item"
              data-cy="suggestion-item"
              onClick={() => {
                setInitialValue(person.name);
                onSelected(person);
                setBoll(false);
              }}
            >
              {person.name}
            </a>
          ))}
        </div>
      </div>

      {filteredPeople.length === 0 && query && (
        <div
          className="notification is-danger is-light mt-3"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
