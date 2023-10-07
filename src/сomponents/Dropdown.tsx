import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
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

enum Gender {
  M = 'm',
}

export const Dropdown: React.FC<Props> = ({
  people,
  changePerson,
  debounceDelay,
}) => {
  const [isDropdownShown, setIsDropdownShown] = useState<boolean>(false);
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const applyQuery = useCallback(debounce(setAppliedQuery, debounceDelay), []);

  const helperSetter = (person: Person) => {
    setQuery(person.name);
    changePerson(person);
  };

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
    <div className={classNames('dropdown', { 'is-active': isDropdownShown })}>
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
                helperSetter(person);
              }}
            >
              {person.sex === Gender.M ? (
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
