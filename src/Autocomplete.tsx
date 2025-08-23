import React, { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { Person } from './types/Person';

type Props = {
  selectedPerson: Person | null;
  onSelected: (person: Person | null) => void;
  debounceDelay?: number;
  people: Person[];
};
export const Autocomplete: React.FC<Props> = ({
  selectedPerson,
  onSelected,
  debounceDelay = 300,
  people,
}) => {
  const [query, setQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setQuery(value), debounceDelay),
    [debounceDelay],
  );
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    debouncedSetQuery(value);

    if (selectedPerson) {
      onSelected(null);
    }
  };

  const handlePersonSelect = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
  };

  const normalizedQuery = query.trim().toLowerCase();

  const filterPeople = (peoples: Person[]): Person[] => {
    if (!normalizedQuery) {
      return peoples;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  };

  const filteredPeople = filterPeople(people);

  const noMatching = normalizedQuery !== '' && filteredPeople.length === 0;

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
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        {isFocused && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onMouseDown={() => {
                    handlePersonSelect(person);
                  }}
                >
                  <p
                    className={cn({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {noMatching && (
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
