import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  onSelected: (val: Person | null) => void;
  onApply: (val: string) => void;
  delay?: number;
  filteredPeople: Person[];
};

export const Autocomplete: React.FC<Props> = ({
  onSelected,
  filteredPeople,
  onApply,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useMemo(() => debounce(onApply, delay), [onApply, delay]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
    onSelected(null);
  };

  const handleSelect = (person: Person) => {
    onSelected(person);
    setIsFocused(false);
    setQuery(person.name);
  };

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isFocused && filteredPeople.length,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person.name}
              onMouseDown={() => {
                handleSelect(person);
              }}
            >
              <p
                className={classNames({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
