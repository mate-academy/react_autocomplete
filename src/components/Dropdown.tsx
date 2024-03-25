import React, { useMemo, useState } from 'react';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';
import debounce from 'lodash.debounce';

type Props = {
  onSelected: (person: Person | null) => void;
  delay: number;
};

export const Dropdown: React.FC<Props> = React.memo(({ onSelected, delay }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);
  const dropdownDelay = useMemo(() => debounce(setIsFocused, delay), [delay]);

  const handleOnSelected = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setIsFocused(false);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
    onSelected(null);
    setIsFocused(false);
    dropdownDelay(true);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(p =>
      p.name.toLocaleLowerCase().includes(appliedQuery.toLocaleLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className="dropdown is-active">
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
        {isFocused && (
          <div className="dropdown-content">
            {filteredPeople.length ? (
              filteredPeople.map((person: Person) => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  style={{ cursor: 'pointer' }}
                  onMouseDown={() => handleOnSelected(person)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleOnSelected(person);
                    }
                  }}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-info' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))
            ) : (
              <div className="dropdown-item" data-cy="no-suggestions-message">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
