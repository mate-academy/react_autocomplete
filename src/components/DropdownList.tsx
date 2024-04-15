import React, { Dispatch, useCallback, useState } from 'react';
import debounce from 'lodash.debounce';

import { Person } from '../types/Person';
import classNames from 'classnames';

interface Props {
  filterPeople: Person[];
  setAppliedQuery: Dispatch<React.SetStateAction<string>>;
  setPerson: React.Dispatch<React.SetStateAction<Person | null>>;
  hideMenu: boolean;
}

export const DropdownList: React.FC<Props> = ({
  filterPeople,
  setAppliedQuery,
  setPerson,
  hideMenu,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQweryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event?.target.value);
    setPerson(null);
  };

  return (
    <div
      className={classNames('dropdown', {
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
        <div
          className={classNames({
            'dropdown-content': hideMenu,
          })}
        >
          {filterPeople.map(people => (
            <a
              className="dropdown-item"
              data-cy="suggestion-item"
              onMouseDown={() => setPerson(people)}
              key={people.name}
            >
              <p className="has-text-link">{people.name}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
