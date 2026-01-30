/* eslint-disable prettier/prettier */
import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelect,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredPeople: Person[] = people.filter(person =>
    person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [delay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value.trim());
    onSelect(null);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    onSelect(person);
    setIsFocused(false);
  };

  const showNoSuggetions = isFocused
    && filteredPeople.length === 0
    && appliedQuery;

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': isFocused,
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

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                style={{ cursor: 'pointer' }}
                key={person.slug}
                onMouseDown={() => handleSelect(person)}
              >
                <p
                  className={classNames({
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
      </div>

      {showNoSuggetions && (
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
