import React, { useCallback, useMemo, useState } from 'react';
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
  const [hasFocus, setHasFocus] = useState(false);

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
      onSelected(null);
    },
    [applyQuery, onSelected],
  );

  const handleOnSelected = useCallback(
    (person: Person) => {
      onSelected(person);
      setQuery(person.name);
      setHasFocus(false);
    },
    [onSelected],
  );

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(p =>
      p.name.toLowerCase().includes(appliedQuery.toLowerCase()),
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
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {hasFocus && (
          <div className="dropdown-content">
            {filteredPeople.length ? (
              filteredPeople.map((person: Person) => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  style={{ cursor: 'pointer' }}
                  onMouseDown={() => handleOnSelected(person)}
                >
                  <p className="has-text-link">{person.name}</p>
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
