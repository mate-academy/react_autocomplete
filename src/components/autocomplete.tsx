import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  onSelected?: (person: Person | string) => void;
};
export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected = () => {},
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    
    if (event.target.value.length === 0) {
        onSelected('');
    }
  };

  const filteredPeople = useMemo(() => {
    return people.filter(({ name }) => {
      return name.toLowerCase().includes(appliedQuery.toLowerCase().trim());
    });
  }, [appliedQuery, people]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setShowDropdown(false)}
        />
      </div>

      {showDropdown && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length ? filteredPeople.map(person => (
              <div
                className="dropdown-item"
                key={person.slug}
              >
                <a
                  className={classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                  href="/"
                  onMouseDown={() => {
                    onSelected(person);
                    setAppliedQuery(person.name);
                    setQuery(person.name);
                  }}
                >
                  {person.name}
                </a>
              </div>
            ))
              : (
                <div className="dropdown-item">
                  <p>No matching suggestion</p>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};
