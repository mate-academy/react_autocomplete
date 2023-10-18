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
    if (filterQuery.length === 0) {
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
          onChange={(event) => {
            handleInputChange(event);
          }}
          value={filterQuery}
          onFocus={handleFocus}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {personsDisplayed.length > 0 && personsDisplayed.map(person => (
            <div
              className="dropdown-item"
              key={person.name}
              onClick={() => handleSelect(person)}
              aria-hidden="true"
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
          {personsDisplayed.length === 0 && (
            <div className="dropdown-item">
              <p>No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
