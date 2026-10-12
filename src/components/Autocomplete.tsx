import React, { useMemo, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

const debounce = <A extends unknown[]>(
  callback: (...args: A) => void,
  delay: number,
) => {
  let timerId = 0;

  return (...args: A) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => callback(...args), delay);
  };
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const applySearch = useMemo(() => debounce(setAppliedSearch, delay), [delay]);

  const filtered = useMemo(
    () =>
      people.filter(person =>
        person.name.toLowerCase().includes(appliedSearch.toLowerCase()),
      ),
    [people, appliedSearch],
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const trimmed = value.trim();

    setSearch(value);
    onSelected(null);

    if (trimmed) {
      applySearch(trimmed);
    } else if (value === '') {
      applySearch('');
    }
  };

  const handleSelect = (person: Person) => {
    setSearch(person.name);
    setAppliedSearch(person.name);
    setIsFocused(false);
    onSelected(person);
  };

  return (
    <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={search}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filtered.length === 0 ? (
            <div
              className="notification is-danger is-light mt-3
              is-align-self-flex-start"
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          ) : (
            filtered.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onMouseDown={() => handleSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
