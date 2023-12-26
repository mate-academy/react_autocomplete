import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  dalay: number;
  queryChange: (query: string) => void;
  setSelectedPerson: (human: Person) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  dalay,
  setSelectedPerson,
  queryChange,
}) => {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(queryChange, dalay), []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  const onMouseDownHandler = (person: Person) => () => {
    setSelectedPerson(person);
    setQuery(person.name);
    queryChange(person.name);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>

      {focused && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {people.length ? (
              people.map(person => (
                <a
                  href="/"
                  role="menu"
                  tabIndex={0}
                  key={person.slug}
                  className="dropdown-item"
                  onMouseDown={onMouseDownHandler(person)}
                >
                  <p className={cn('has-text-link', {
                    'has-text-danger': person.sex === 'f',
                  })}
                  >
                    {person.name}
                  </p>
                </a>
              ))
            ) : (
              <div className="dropdown-item">
                <p className="has-text-danger">
                  No matching suggestions
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
