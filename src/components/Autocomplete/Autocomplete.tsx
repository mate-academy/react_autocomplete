import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelect,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const debouncedApplyQuery = useMemo(
    () => debounce(setAppliedQuery, delay),
    [delay],
  );

  useEffect(() => () => debouncedApplyQuery.cancel(), [debouncedApplyQuery]);

  const visiblePeople = useMemo(() => {
    const normalizedQuery = appliedQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [appliedQuery, people]);

  const handleChange = (value: string) => {
    setQuery(value);
    debouncedApplyQuery(value);
    onSelect(null);
  };

  const handleSelectPerson = (person: Person) => {
    setQuery(person.name);
    setShowDropdown(false);
    onSelect(person);
  };

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': showDropdown && visiblePeople.length > 0,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            className="input"
            placeholder="Enter a part of the name"
            data-cy="search-input"
            value={query}
            onChange={e => handleChange(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => {
              setTimeout(() => setShowDropdown(false), 150);
            }}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {visiblePeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelectPerson(person)}
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

      {showDropdown && visiblePeople.length === 0 && (
        <div
          className="notification
          is-danger is-light mt-3 is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
