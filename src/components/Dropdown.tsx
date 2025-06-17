import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import cls from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay: number;
  onSelected: (person: Person | null) => void;
};

export const Dropdown: React.FC<Props> = ({ people, delay, onSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // const settedQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  // Use useMemo to memoize the debounced function
  const settedQuery = useMemo(
    () => debounce(setAppliedQuery, delay),
    [setAppliedQuery, delay],
  );

  // Clean up the debounced function on unmount or when delay changes
  useEffect(() => {
    return () => settedQuery.cancel();
  }, [settedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.trim());
    settedQuery(event.target.value.trim());
    onSelected(null);
  };

  const handlePersonSelect = (person: Person) => {
    setQuery(person.name);
    setIsFocused(false);
    onSelected(person);
  };

  const visiblePeople = people.filter(person =>
    person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  return (
    <>
      <div
        className={cls('dropdown', {
          'is-active': isFocused,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 100)}
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          />
        </div>

        <div
          className="dropdown-menu"
          id="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
        >
          <div className="dropdown-content">
            {visiblePeople.map(person => (
              <div
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handlePersonSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!visiblePeople.length && (
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
    </>
  );
};
