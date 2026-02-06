import React, { useMemo, useState } from 'react';
import { Person } from '../types/Person';
import clsx from 'clsx';
import debounce from 'lodash.debounce';

type Props = {
  people?: Person[];
  onSelect?: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete = ({
  people,
  onSelect = () => {},
  delay = 300,
}: Props) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const normalizedQuery = appliedQuery.toLowerCase();

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    setQuery(value);
    applyQuery(value.trim());
    onSelect(null);
  };

  const handleSelectPerson = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsFocused(false);
    onSelect(person);
  };

  const filteredPeople = useMemo(() => {
    return people?.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, people]);
  const hasSuggestions = Boolean(filteredPeople?.length);

  return (
    <>
      <div
        className={clsx('dropdown', {
          'is-active': normalizedQuery.length > 0 && isFocused,
        })}
      >
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
        {hasSuggestions && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople?.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={() => handleSelectPerson(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isFocused && query.trim().length > 0 && !hasSuggestions && (
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
