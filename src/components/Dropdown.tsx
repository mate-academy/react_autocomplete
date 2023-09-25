import cn from 'classnames';
import debounce from 'lodash.debounce';
import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[]
  delay: number,
  onSelect?: (person: Person) => void,
}

export const Dropdown: React.FC<Props> = ({
  people,
  delay,
  onSelect = () => {},
}) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person => (
      person.name.toLowerCase().trim().includes(appliedQuery.toLowerCase())
    ));
  }, [appliedQuery]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          value={query}
          placeholder="Enter a part of the name"
          className="input"
          onChange={handleQueryChange}
          onFocus={() => setIsDropdown(true)}
          onBlur={() => setIsDropdown(false)}
        />
      </div>

      {isDropdown && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">

            {filteredPeople.length ? (
              filteredPeople.map(person => (
                <a
                  key={person.slug}
                  href="/"
                  className="dropdown-item"
                  onMouseDown={() => {
                    onSelect(person);
                    setQuery(person.name);
                  }}
                >
                  <p
                    className={cn({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </a>
              ))
            ) : (
              <p className="dropdown-item has-text-danger">
                No matching suggestions
              </p>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
