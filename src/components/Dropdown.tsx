import { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';

import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

const getFilteredPeople = (people: Person[], query: string) => {
  const normalizeQuery = query.trim().toLowerCase();

  return people.filter(person =>
    person.name.toLowerCase().includes(normalizeQuery),
  );
};

interface Props {
  people: Person[];
  delay: number;
  onSelected: (person: Person | null) => void;
}

const Dropdown: FC<Props> = ({ people, delay, onSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const applyQuery = useCallback(
    debounce((value: string) => {
      setAppliedQuery(value);
      setShowDropdown(true);
    }, delay),
    [delay],
  );

  const visiblePeople = useMemo(
    () => getFilteredPeople(people, appliedQuery),
    [people, appliedQuery],
  );

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setQuery(value);
    applyQuery(value);
    setShowDropdown(false);
    onSelected(null);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 100);
  };

  return (
    <div
      className={classNames('dropdown', {
        'is-active': showDropdown,
      })}
    >
      <div className="dropdown-trigger">
        <input
          value={query}
          onChange={handleQueryChange}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onFocus={() => setShowDropdown(true)}
          onBlur={handleInputBlur}
        />
      </div>

      {visiblePeople.length !== 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {visiblePeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => onSelected(person)}
              >
                <p
                  className={classNames('', {
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
      )}

      {visiblePeople.length === 0 && query && (
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
  );
};

export default Dropdown;
