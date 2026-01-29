import { Person } from '../types/Person';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

type AutocompleteProps = {
  people: Person[];
  delay?: number;
};

export const Autocomplete = ({ people, delay = 500 }: AutocompleteProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(query.toLowerCase()),
  );

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setQuery(value), delay),
    [delay],
  );

  return (
    <div className={classNames('dropdown', { 'is-active': isFocused })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={e => {
            debouncedSetQuery(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <div
              key={person.name}
              className="dropdown-item"
              data-cy="suggestion-item"
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
