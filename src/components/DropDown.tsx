/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';
import { debounce } from '../services/debounce';
import { filterPersons } from '../services/filterPersons';

type Prop = {
  persons: Person[];
  onSelected?: (person: Person) => void;
  delay: number
};

export const Dropdown: React.FC<Prop> = React.memo(({
  persons,
  onSelected = () => {},
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showDropDown, setShowDropDown] = useState(false);

  const applyQuery = React.useCallback(debounce(setAppliedQuery, delay), []);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPersons = React.useMemo(() => {
    return filterPersons(persons, appliedQuery);
  }, [appliedQuery, persons]);

  return (
    <div className={showDropDown ? 'dropdown is-active' : 'dropdown'}>
      <div className="dropdown-trigger">
        <input
          onFocus={() => setShowDropDown(true)}
          value={query}
          onChange={handleChangeQuery}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {filteredPersons.length >= 1 ? (
          filteredPersons.map((person) => (
            <div key={person.slug} className="dropdown-content">
              <button
                type="button"
                onClick={() => {
                  onSelected(person);
                  setShowDropDown(false);
                }}
                className={cn('dropdown-item has-text-link', {
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </button>
            </div>
          ))
        ) : (
          <div className="dropdown-item has-text-danger">
            No matching suggestions
          </div>
        )}
      </div>
    </div>
  );
});
