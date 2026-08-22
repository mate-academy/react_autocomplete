import React, { useMemo, useState, useRef } from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';
import { debounce } from '../utils/debounce';

interface Props {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const lastAppliedRef = useRef('');

  const applyQuery = useMemo(
    () =>
      debounce<string>(newValue => {
        if (newValue === lastAppliedRef.current) {
          return;
        }

        lastAppliedRef.current = newValue;
        setAppliedQuery(newValue);
      }, delay),
    [delay],
  );

  const filteredPeople = useMemo(() => {
    const normalizedQuery = appliedQuery.trim().toLowerCase();

    if (appliedQuery.length === 0) {
      return people;
    }

    if (normalizedQuery === '') {
      return [];
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [people, appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setIsFocused(true);
    setQuery(newValue);
    onSelected(null);
    applyQuery(newValue);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    lastAppliedRef.current = person.name;
    onSelected(person);
    setIsFocused(false);
  };

  return (
    <div className={classNames('dropdown', { 'is-active': isFocused })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsFocused(true)}
          onClick={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 150);
          }}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {appliedQuery.length > 0 && filteredPeople.length === 0 ? (
            <div
              className="dropdown-item"
              data-cy="no-suggestions-message"
              role="alert"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          ) : (
            filteredPeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={event => {
                  event.preventDefault();
                  handleSelect(person);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
