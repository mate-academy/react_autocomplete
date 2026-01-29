import { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import { Person } from '../types/Person';

type AutocompleteProps = {
  people: Person[];
  onSelect: (person: Person) => void;
  delay?: number;
};

export const Autocomplete = ({
  people,
  onSelect,
  delay = 500,
}: AutocompleteProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [curruntInput, setCurruntInput] = useState('');
  const [query, setQuery] = useState('');

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(query.toLowerCase()),
  );

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setQuery(value), delay),
    [delay],
  );

  const handleSelectPerson = (person: Person) => {
    setQuery('');
    setCurruntInput('');
    setIsFocused(false);
    onSelect(person);
  };

  return (
    <div className={classNames('dropdown', { 'is-active': isFocused })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={curruntInput}
          onChange={e => {
            setCurruntInput(e.target.value);
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
              onMouseDown={e => {
                e.preventDefault(); // ⬅️ блокує onBlur інпута
                handleSelectPerson(person); // ⬅️ тут setIsFocused(false) закриє dropdown
              }}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
