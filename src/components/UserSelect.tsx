import { Person } from '../types/Person';
import React, { useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

type Props = {
  people: Person[];
  delay?: number;
  onSelected?: (person: Person | null) => void;
};

export const UserSelect = ({
  people,
  delay = 300,
  onSelected = () => {},
}: Props) => {
  const [query, setQuery] = React.useState('');
  const [appliedQuery, setAppliedQuery] = React.useState('');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    onSelected(null);
  };

  const filterPeople = useMemo(() => {
    if (!appliedQuery.trim()) {
      return people;
    }

    return people.filter(person => person.name.includes(appliedQuery));
  }, [people, appliedQuery]);

  return (
    <>
      <div className={classNames('dropdown', { 'is-active': isDropdownOpen })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setIsDropdownOpen(false)}
          />
        </div>

        {isDropdownOpen && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filterPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  data-cy="suggestion-item"
                  onClick={() => {
                    onSelected(person);
                    setQuery(person.name);
                    setAppliedQuery(person.name);
                    setIsDropdownOpen(false);
                  }}
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
        )}
      </div>

      {filterPeople.length === 0 && appliedQuery.trim().length > 0 && (
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
