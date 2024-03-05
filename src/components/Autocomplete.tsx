import React, { useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  peopleFromServer: Person[];
  delay: number;
};

export const Autocomplete: React.FC<Props> = ({ peopleFromServer, delay }) => {
  const [peoples] = useState<Person[]>(peopleFromServer);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  // console.log('query ->', query);
  // console.log('applied query ->', appliedQuery);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeoples = useMemo(() => {
    return peoples.filter(people =>
      people.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, peoples]);

  // console.log('filtered peoples ->', filteredPeoples);

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onChange={handleQueryChange}
            value={query}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeoples.map(people => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={people.slug}
              >
                <p
                  className={classNames({
                    'has-text-link': people.sex === 'm',
                    'has-text-danger': people.sex === 'f',
                  })}
                >
                  {people.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredPeoples.length === 0 && (
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
