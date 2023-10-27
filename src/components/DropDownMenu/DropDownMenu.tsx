import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../../data/people';
import { Person } from '../../types/Person';

type Props = {
  setSelected: (person: Person) => void;
};
export const DropDownMenu: React.FC<Props> = ({ setSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showDropDownMenu, setShowDropDownMenu] = useState(false);
  // eslint-disable-next-line
  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(
    () => peopleFromServer.filter((person: Person) => person.name
      .toLowerCase().includes(appliedQuery.toLowerCase().trim())),
    [appliedQuery],
  );

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setShowDropDownMenu(true)}
          onBlur={() => setShowDropDownMenu(false)}
        />
      </div>

      {showDropDownMenu && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length ? filteredPeople.map((person: Person) => (
              <div className="dropdown-item" key={person.slug}>
                <a
                  href={`#${person.slug}`}
                  className={cn(
                    { 'has-text-link': person.sex === 'm' },
                    { 'has-text-danger': person.sex === 'f' },
                  )}
                  onMouseDown={() => {
                    setSelected(person);
                    setQuery(person.name);
                    setAppliedQuery(person.name);
                  }}
                >
                  {person.name}
                </a>
              </div>
            ))
              : (
                <div className="dropdown-item">
                  <p>
                    No matching suggestions
                  </p>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};
