import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';

type Props = {
  onSelectedPerson: (person: Person | null) => void;
  delay: number;
};

export const Autocomplite: React.FC<Props> = ({
  onSelectedPerson,
  delay,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce((str: string) => {
    setAppliedQuery(str);
    setIsActive(true);
  }, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    onSelectedPerson(null);
    setIsActive(false);
  };

  const filteredPeople = useMemo(() => {
    const people = [...peopleFromServer];
    const trimmedQuery = appliedQuery.trim().toLowerCase();

    return people.filter(({ name }) => name
      .toLowerCase().includes(trimmedQuery));
  }, [appliedQuery]);

  return (
    <div className={classNames('dropdown', {
      'is-active': isActive,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
        />
      </div>

      <div
        className="dropdown-menu"
        role="menu"
        data-cy="suggestions-list"
      >
        <div className="dropdown-content">
          {!filteredPeople.length
            ? (
              <div className="dropdown-item">No matching suggestions</div>
            ) : (
              filteredPeople.map(person => (
                <a
                  className="dropdown-item"
                  href="/"
                  key={person.slug}
                  onMouseDown={() => {
                    setQuery(person.name);
                    onSelectedPerson(person);
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
                </a>
              )))}
        </div>
      </div>
    </div>
  );
};
