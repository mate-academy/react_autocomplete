import React, { useState, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';

import { Person } from '../types/Person';
import './Autocomplete.scss';

interface Props {
  people: Person[];
  delay: number;
  onSelected: (person: Person) => void;
}

export const Autocomplete: React.FC<Props> = React.memo(({
  people,
  delay,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [preparedQuery, setPreparedQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const currentPeople = useMemo(() => {
    return people.filter(human => {
      return human.name.toLowerCase().includes(preparedQuery.toLowerCase());
    });
  }, [people, preparedQuery]);

  const prepareQuery = useCallback(debounce(setPreparedQuery, delay), []);

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    prepareQuery(event.target.value);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={inputHandler}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>

      {focused && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {currentPeople.length
              ? currentPeople.map(human => (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                  href="#"
                  className="dropdown-item has-text-link"
                  key={human.slug}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setQuery(human.name);
                    setPreparedQuery(human.name);
                    onSelected(human);
                    setFocused(false);
                  }}
                >
                  {human.name}
                </a>
              )) : (
                <div className="dropdown-item has-text-link">
                  No matching suggestions
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
});
