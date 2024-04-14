import React, { Dispatch, useCallback, useState } from 'react';
import debounce from 'lodash.debounce';

import { Person } from '../types/Person';
import classNames from 'classnames';

interface Props {
  filterPeople: Person[];
  setErrorMessage: Dispatch<React.SetStateAction<boolean>>;
  setAppliedQuery: Dispatch<React.SetStateAction<string>>;
  setPerson: React.Dispatch<React.SetStateAction<Person | null>>;
}

export const DropdownList: React.FC<Props> = ({
  filterPeople,
  setErrorMessage,
  setAppliedQuery,
  setPerson,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQweryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event?.target.value);

    setErrorMessage(false);
    setPerson(null);
  };

  return (
    <div
      className={classNames({
        dropdown: true,
        'is-active': isActive,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          // ref={inputElement}
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onChange={handleQweryChange}
          onFocus={() => {
            setIsActive(true);
          }}
          onBlur={() => {
            setIsActive(false);
          }}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filterPeople.map(people => (
            <div
              className={classNames('dropdown-item', {
                'has-background-info-light': isHovered,
              })}
              data-cy="suggestion-item"
              onMouseDown={() => setPerson(people)}
              key={people.name}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <p className="has-text-link">{people.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
