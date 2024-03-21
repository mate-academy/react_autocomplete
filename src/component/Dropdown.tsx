import React, { useState, useMemo, useCallback } from 'react';
import { Person } from '../types/Person';

import { peopleFromServer } from '../data/people';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

type Props = {
  onSelected: (person: Person | null) => void;
  delay: number;
};

export const Dropdown: React.FC<Props> = ({ onSelected, delay = 300 }) => {
  const [query, setQuery] = useState('');
  const [applyedQuery, setApplyedQuery] = useState('');

  const [selected, setSelected] = useState(false);

  const applyQuery = useCallback(debounce(setApplyedQuery, delay), [
    setApplyedQuery,
  ]);

  const handleQueryChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);

    setQuery(event.target.value);
    onSelected(null);
  };

  const filteredPeople = useMemo(() => {
    const normalisedQuery = applyedQuery.toLowerCase().trim();

    return peopleFromServer.filter(person => {
      const normalisedPerson = person.name.toLowerCase();

      return normalisedPerson.includes(normalisedQuery);
    });
  }, [applyedQuery]);

  const handlePersonClick = (person: Person) => {
    setQuery(person.name);
    setSelected(false);
    onSelected(person);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          value={query}
          className="input"
          data-cy="search-input"
          onChange={handleQueryChanged}
          onFocus={() => setSelected(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {selected && (
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.name}
                onClick={() => handlePersonClick(person)}
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
        )}
        {!filteredPeople.length && (
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
