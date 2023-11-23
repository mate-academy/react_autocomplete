import { useState, useMemo, useCallback } from 'react';
import cn from 'classnames';

import { Person } from '../types/Person';

type Props = {
  people: Person[];
  changePerson: (person: Person) => void;
  debounceDelay: number;
};

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay: number) {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const Dropdown: React.FC<Props> = ({
  people,
  changePerson,
  debounceDelay,
}) => {
  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, debounceDelay), []);

  const filteredPeople = useMemo(() => {
    return people.filter(person => person.name.toLowerCase()
      .includes(query.toLowerCase()));
  }, [people, appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const textQuery = event.target.value;

    setQuery(textQuery);
    applyQuery(textQuery);
  };

  return (
    <div className={cn('dropdown', { 'is-active': isDropdownShown })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsDropdownShown(true)}
          onBlur={() => setIsDropdownShown(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length ? filteredPeople.map(person => (
            <button
              type="button"
              className="dropdown-item"
              key={person.name}
              onMouseDown={() => {
                setQuery(person.name);
                changePerson(person);
              }}
            >
              {person.sex === 'm' ? (
                <p className="has-text-link">{person.name}</p>
              ) : (
                <p className="has-text-danger">{person.name}</p>
              )}
            </button>
          )) : (
            <div className="dropdown-item">
              No matching suggestions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
