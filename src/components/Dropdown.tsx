import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import './Dropdown.scss';

type Props = {
  people: Person[],
  onSelect: (person: Person) => void,
  delay: number,
};

function debounce(callback: Function, delay: number) {
  let timerId = 0;

   return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const Dropdown: React.FC<Props> = ({ people, onSelect, delay }) => {
  const [query, setQuery] = useState('');
  const [focusedInput, setFocusedInput] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const queryChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setFocusedInput(true);
  };

  const selectHandler = (person: Person) => {
    onSelect(person);
    setQuery(person.name);
  };

  const filteredPeople = useMemo(() => {
    return people
      .filter((person) => person.name
        .toLowerCase()
        .includes(query.toLowerCase()));
  }, [appliedQuery]);

  return (
    <div className={classNames(
      'dropdown',
      { 'is-active': focusedInput },
    )}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          onChange={queryChangeHandler}
          onFocus={() => {
            setFocusedInput(true);
          }}
          onBlur={() => {
            setFocusedInput(false);
          }}
          value={query}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length > 0
            ? (filteredPeople.map(person => (
              <div
                className="dropdown-item"
                key={person.slug}
                onMouseDown={() => {
                  selectHandler(person);
                }}
                role="button"
                tabIndex={0}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))
            ) : <p>No matching suggestions</p>}
        </div>
      </div>
    </div>
  );
};
