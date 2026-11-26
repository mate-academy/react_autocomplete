import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';
import classNames from 'classnames';

type Props = {
  onSelect: (person: Person | null) => void;
  delay: number;
};

export const Dropdown: React.FC<Props> = ({ onSelect, delay }) => {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsDropdownActive(true);
    onSelect(null);
  };

  const handleClick = (person: Person) => {
    onSelect(person);
    setQuery(person.name);
    setIsDropdownActive(false);
  };

  const filterPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
    );
  }, [appliedQuery]);

  return (
    <div className={classNames('dropdown', { 'is-active': isDropdownActive })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleInputChange}
          onBlur={() => setIsDropdownActive(false)}
          onFocus={() => setIsDropdownActive(true)}
        />
      </div>

      {isDropdownActive && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filterPeople.length ? (
              filterPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onMouseDown={() => handleClick(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
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
      )}
    </div>
  );
};
