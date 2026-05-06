import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Person } from './types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({ people, onSelected, delay = 300 }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const lastAppliedQuery = useRef('');

  // Debounce logic: update appliedQuery only after typing stops
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query !== lastAppliedQuery.current) {
        setAppliedQuery(query);
        lastAppliedQuery.current = query;
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [query, delay]);

  const filteredPeople = people.filter(p =>
    p.name.toLowerCase().includes(appliedQuery.toLowerCase())
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelected(null);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    lastAppliedQuery.current = person.name;
    onSelected(person);
    setIsOpen(false);
  };

  return (
    <div className={classNames("dropdown", { "is-active": isOpen })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 300)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(p => (
            <a
              key={p.name}
              className="dropdown-item"
              data-cy="suggestion-item"
              onClick={() => handleSelect(p)}
            >
              <p className="has-text-link">{p.name}</p>
            </a>
          ))}

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
        </div>
      </div>
    </div>
  );
};
