import classNames from 'classnames';
import React, { useState, useMemo, useCallback } from 'react';

import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';

function debounce(callback: (...args: string[]) => void, delay: number) {
  let timerId = 0;

  return (...args: string[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

type Props = {
  onSelected: (person: Person | null) => void;
  delay: number;
};

export const Dropdown: React.FC<Props> = ({ onSelected, delay }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleButtonClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    onSelected(person);
    setQuery(person.name);
  };

  const hasDropdown = React.useMemo(() => {
    return query === appliedQuery;
  }, [query, appliedQuery]);

  const visiblePeople = useMemo(() => {
    return [...peopleFromServer].filter((person) => {
      return person.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [appliedQuery, peopleFromServer]);

  return (
    <div className={classNames('dropdown', { 'is-active': appliedQuery })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
        />
      </div>

      {hasDropdown && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {visiblePeople.length ? (
              visiblePeople.map((person) => (
                <a
                  href="/#"
                  className="dropdown-item"
                  key={person.slug}
                  onClick={(event) => handleButtonClick(event, person)}
                >
                  <p
                    className={classNames({
                      'has-text-danger': person.sex === 'f',
                      'has-text-link': person.sex === 'm',
                    })}
                  >
                    {person.name}
                  </p>
                </a>
              ))
            ) : (
              <div className="dropdown-item">
                <p className="has-text">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
