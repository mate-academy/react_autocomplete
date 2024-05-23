import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

type Props = {
  onSelected: (person: Person | null) => void;
  delay: number;
};

export const Dropdown: React.FC<Props> = React.memo(({ onSelected, delay }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [typing, setTyping] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce((q: string) => {
      setAppliedQuery(q);
      setTyping(false);
    }, delay),
    [delay],
  );

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setQuery(value);
      setTyping(true);
      applyQuery(value);
      onSelected(null);
    },
    [applyQuery, onSelected],
  );

  const handleOnSelected = useCallback(
    (person: Person) => {
      onSelected(person);
      setQuery(person.name);
      setTyping(false);
      setHasFocus(false);
    },
    [onSelected],
  );

  const filteredPeople = useMemo(() => {
    if (appliedQuery === '' && hasFocus) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(p =>
      p.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, hasFocus]);

  useEffect(() => {
    return () => {
      applyQuery.cancel();
    };
  }, [applyQuery]);

  return (
    <div
      className={classNames('dropdown', { 'is-active': hasFocus && !typing })}
    >
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
        {hasFocus && !typing && (
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
