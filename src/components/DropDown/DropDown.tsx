import React, { useMemo, useCallback, useState } from 'react';
import classNames from 'classnames';

import { Person } from '../../types/Person';
import './DropDown.scss';

type Props = {
  onSelected: (person: Person) => void,
  listOfPeople: Person[],
  delay: number,
};

function debounce(callback: (...args: any) => void, delay: number) {
  let timerFilter = 0;

  return (...args: any) => {
    window.clearTimeout(timerFilter);

    timerFilter = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const DropDown: React.FC<Props> = ({
  onSelected,
  listOfPeople,
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [focusInput, setFocusInput] = useState(false);
  const [applieQuery, setApplieQuery] = useState('');

  const applyQuery = useCallback(debounce(setApplieQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  function handleSelection(person: Person) {
    onSelected(person);
    setQuery(person.name);
  }

  const filterPeople = useMemo(() => {
    return listOfPeople
      .filter(people => {
        return people.name.toUpperCase().includes(query.toUpperCase());
      });
  }, [applieQuery]);

  return (
    <div className={classNames('dropdown', {
      'is-active': focusInput,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setFocusInput(true)}
          onBlur={() => setFocusInput(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filterPeople.length > 0 ? (
            filterPeople.map(person => (
              <div
                className="dropdown-item"
                key={person.slug}
                role="button"
                tabIndex={0}
                onMouseDown={() => handleSelection(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))
          ) : 'No matching suggestions'}

        </div>
      </div>
    </div>
  );
};
