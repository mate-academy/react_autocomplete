import React, { useMemo, useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';
import classNames from 'classnames';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  const normalizedQuery = appliedQuery.trim().toLowerCase();

  const filteredPeople = useMemo(() => {
    if (!normalizedQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [people, normalizedQuery]);

  const hasSuggestions = filteredPeople.length > 0;

  useEffect(() => {
    return () => applyQuery.cancel();
  }, [applyQuery]);

  return (
    <>
      <div className={classNames('dropdown', { 'is-active': isDropdownOpen })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            data-qa="search-input"
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              applyQuery(event.target.value);
              onSelected(null);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
          />
        </div>

        {hasSuggestions && (
          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
            data-qa="suggestions-list"
          >
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  data-qa="suggestion-item"
                  key={person.slug}
                  onMouseDown={() => {
                    setQuery(person.name);
                    setAppliedQuery(person.name);
                    setIsDropdownOpen(false);
                    onSelected(person);
                  }}
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

      {!hasSuggestions && (
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
          data-qa="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
