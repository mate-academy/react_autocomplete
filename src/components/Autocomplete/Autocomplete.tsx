import React, { useCallback, useMemo, useState } from 'react';

import debounce from 'lodash.debounce';
import cn from 'classnames';

import './Autocomplete.scss';

import { peopleFromServer } from '../../data/people';
import { useClickOutside } from './useClickOutside';
import { Person } from '../../types/Person';

interface Props {
  onSelected: (person: Person | null) => void;
}

const DELAY = 300 as const;

export const Autocomplete: React.FC<Props> = ({ onSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const close = useCallback(() => {
    setIsFocused(false);
  }, []);

  const refDropdown = useClickOutside(close);

  const debounceQuery = useMemo(() => debounce(setAppliedQuery, DELAY), []);

  const handleQueryChange = useCallback(
    (value: string) => {
      debounceQuery(value);
      setQuery(value);
      onSelected(null);
    },
    [debounceQuery, onSelected],
  );

  const handleOnClick = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className="dropdown is-active" ref={refDropdown}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={event => handleQueryChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {filteredPeople.length && isFocused ? (
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onClick={() => {
                  setIsFocused(false);
                  handleOnClick(person);
                }}
              >
                <p
                  className={cn('has-text-link', {
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {!filteredPeople.length && isFocused && (
          <div
            className="notification is-danger
                       is-light mt-3 is-align-self-flex-start"
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
