import React, { useEffect, useState } from 'react';
import { Person } from './types/Person';
import classNames from 'classnames';

type Props = {
  persons: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  persons,
  delay,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [appliedQuery, setappliedQuery] = useState('');

  useEffect(() => {
    if (!query.trim()) {
      setappliedQuery(query);

      return;
    }

    const timer = setTimeout(() => {
      setappliedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  const filteredPerson = persons.filter(person =>
    person.name
      .toLocaleLowerCase()
      .includes(appliedQuery.trim().toLocaleLowerCase()),
  );

  return (
    <>
      <div className={classNames('dropdown', { 'is-active': isOpen })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              onSelected(null);
            }}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPerson.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.name}
                onClick={() => {
                  onSelected(person);
                  setQuery(person.name);
                  setIsOpen(false);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isOpen && filteredPerson.length === 0 && (
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
