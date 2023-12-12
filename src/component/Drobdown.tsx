import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: React.Dispatch<React.SetStateAction<Person | null>>;
  delay: number;
};

export const Dropdown: React.FC<Props> = ({
  people,
  onSelected,
  delay,
}) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const textQuery = event.target.value;

    setQuery(textQuery);
    applyQuery(textQuery);
  };

  const filteredPeople = useMemo(() => {
    const lowQuery = appliedQuery.trim().toLowerCase();

    return people.filter(({ name }) => name.toLowerCase().includes(lowQuery));
  }, [people, appliedQuery]);

  return (
    <div className={cn('dropdown', {
      'is-active': isDropdown,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onFocus={() => setIsDropdown(true)}
          onBlur={() => setIsDropdown(false)}
          onChange={handleQueryChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length ? filteredPeople.map(pers => (
            <a
              href="/"
              className="dropdown-item"
              key={pers.slug}
              onMouseDown={() => {
                setQuery(pers.name);
                onSelected(pers);
              }}
            >
              <p className={cn({
                'has-text-link': pers.sex === 'm',
                'has-text-danger': pers.sex === 'f',
              })}
              >
                {pers.name}
              </p>
            </a>
          )) : (
            <div className="dropdown-item">
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
