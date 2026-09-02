import React, { useState, useMemo } from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';

type AutocompleteProps = {
  onSelected: (person: Person | null) => void;
  selectedPerson?: Person | null;
  delay?: number;
  people: Person[];
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  onSelected,
  selectedPerson,
  delay = 300,
  people,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useMemo(
    () =>
      debounce((newQuery: string) => {
        setAppliedQuery(newQuery);
      }, delay),
    [delay],
  );

  const filteredPeople = useMemo(() => {
    if (appliedQuery === '') {
      return people;
    }

    const lowerCaseQuery = appliedQuery.toLowerCase().trim();

    if (lowerCaseQuery === '') {
      return [];
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(lowerCaseQuery),
    );
  }, [appliedQuery, people]);

  return (
    <>
      <div className={cn('dropdown', { 'is-active': isFocused })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onClick={() => setIsFocused(true)}
            onChange={event => {
              const newQuery = event.target.value;

              setQuery(newQuery);

              if (selectedPerson && selectedPerson.name !== newQuery) {
                onSelected(null);
              }

              setIsFocused(true);
              applyQuery(newQuery);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onMouseDown={event => {
                  event.preventDefault();
                  onSelected(person);
                  setQuery(person.name);
                  setAppliedQuery(person.name);
                  setIsFocused(false);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isFocused && filteredPeople.length === 0 && (
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
