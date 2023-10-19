import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import './Dropdown.scss';
import { Person } from '../types/Person';

type Props = {
  delay: number,
  personsDisplayed: Person[],
  onSelected: (person: Person | null) => void,
  setQuery: (query: string) => void
};

export const Dropdown: React.FC<Props> = (
  {
    delay,
    personsDisplayed,
    onSelected,
    setQuery,
  },
) => {
  const [dropdownActive, setDropdownActive] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce((query: string) => {
      setQuery(query);
      setDropdownActive(true);
    }, delay),
    [],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDropdownActive(false);
    setFilterQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleFocus = () => {
    if (!filterQuery.length) {
      setDropdownActive(true);
    }
  };

  const handleSelect = (person: Person) => {
    onSelected(person);
    setFilterQuery(person.name);
    setDropdownActive(false);
    setQuery('');
  };

  return (
    <div className={classNames('dropdown', { 'is-active': dropdownActive })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          onChange={handleInputChange}
          value={filterQuery}
          onFocus={handleFocus}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {/* eslint-disable-next-line no-extra-boolean-cast */}
          {!!personsDisplayed.length ? personsDisplayed.map(person => (
            <button
              type="button"
              className="dropdown-item"
              key={person.name}
              onClick={() => handleSelect(person)}
            >
              <p className="has-text-link">{person.name}</p>
            </button>
          )) : (
            <div className="dropdown-item">
              <p>No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
