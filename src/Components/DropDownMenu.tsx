import { Person } from '../types/Person';

import React, { FC, useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';

interface Props {
  people: Person[];
  delay?: number;
  changeChosenPerson: (person: Person | null) => void;
  changeAppliedQuery: (value: string) => void;
}

export const DropDownMenu: FC<Props> = ({
  people,
  delay = 300,
  changeChosenPerson,
  changeAppliedQuery,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useCallback(debounce(changeAppliedQuery, delay), []);

  const handlePersonSelection = (person: Person) => {
    changeChosenPerson(person);
    setQuery(person.name);
    setIsFocused(false);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    changeChosenPerson(null);
    applyQuery(event.target.value.trim());
  };

  return (
    <>
      <div className="dropdown is-active">
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

        {isFocused && people.length && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {people.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onMouseDown={() => handlePersonSelection(person)}
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
          </div>
        )}
      </div>

      {!people.length && (
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
