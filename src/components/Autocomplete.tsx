import cn from 'classnames';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';
import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

type Props = {
  onSelect: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({ onSelect = () => {} }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const delay = 300;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce(e => {
      setAppliedQuery(e);
      setIsFocused(true);
    }, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelect(null);
    setIsFocused(false);
    applyQuery(event.target.value);
  };

  const filterPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name
        .toLowerCase()
        .trim()
        .includes(appliedQuery.trim().toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className={cn('dropdown', { 'is-active': isFocused })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={handleQueryChange}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {isFocused && filterPeople.length > 0 && (
          <div className="dropdown-content">
            {filterPeople.map((person: Person) => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.name}
                onClick={() => (
                  onSelect(person), setQuery(person.name), setIsFocused(false)
                )}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        )}

        {filterPeople.length === 0 && appliedQuery && (
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
  );
};
