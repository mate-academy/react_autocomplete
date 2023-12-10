import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';

import { Person } from '../types/Person';

type Props = {
  onSelect: (person: Person | undefined) => void;
  peopleList: Person[];
  delay: number;
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

export const Autocomplete: React.FC<Props> = (
  { onSelect, peopleList, delay },
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const filteredList = useMemo(() => {
    const formattedQuery = appliedQuery.trim().toLowerCase();

    return peopleList.filter(
      human => human.name.toLowerCase().includes(formattedQuery),
    );
  }, [appliedQuery, peopleList]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleSelect = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person | undefined,
  ) => {
    event.preventDefault();
    onSelect(person);
    setIsFocused(false);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onFocus={handleFocus}
          onChange={handleQuery}
        />
      </div>

      {isFocused && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredList.length ? (
              filteredList.map((person) => (
                <a
                  className="dropdown-item"
                  key={person.slug}
                  href="/"
                  onClick={(event) => handleSelect(event, person)}
                >
                  <p
                    className={classNames(
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger',
                    )}
                  >
                    {person.name}
                  </p>
                </a>
              ))
            ) : (
              <p className="has-text-link">No matching suggestions</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
