import React, { useCallback, useMemo } from 'react';
import cn from 'classnames';
import { useState } from 'react';
import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';

interface Props {
  onSelect: (person: Person | null) => void;
}

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay = 300) {
  let timerId = 0;

  return (...args: unknown[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const Dropdown: React.FC<Props> = ({ onSelect }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const applyQuery = useCallback(debounce(setAppliedQuery), []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      applyQuery(e.target.value.trim());
      onSelect(null);
    },
    [applyQuery, onSelect],
  );

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className={cn('dropdown', { 'is-active': isDropdownVisible })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsDropdownVisible(true)}
          onBlur={() => {
            setTimeout(() => setIsDropdownVisible(false), 1000);
          }}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.length ? (
            filteredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.name}
                onClick={() => onSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))
          ) : (
            <div
              className="
                notification
                is-danger
                is-light
                mt-3
                is-align-self-flex-start
              "
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
