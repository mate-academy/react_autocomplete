import React, { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';
import cn from 'classnames';

type Props = {
  peopleFromServer: Person[];
  onSelected: (person: Person | null) => void;
  delay: number;
};

export const Dropdown: React.FC<Props> = ({
  peopleFromServer,
  onSelected,
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    onSelected(null);
  };

  const handleSelectPerson = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsActive(false);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => {
      return person.name
        .toLowerCase()
        .includes(appliedQuery.toLowerCase().trim());
    });
  }, [appliedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownElement = document.querySelector('.dropdown');
      const isClickedOutside =
        dropdownElement && !dropdownElement.contains(event.target as Node);

      if (isClickedOutside) {
        setIsActive(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={cn('dropdown', { 'is-active': isActive })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsActive(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {filteredPeople.length > 0 && (
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <button
                className="dropdown-item button is-white"
                data-cy="suggestion-item"
                key={person.slug}
                type="button"
                onClick={() => handleSelectPerson(person)}
              >
                <p
                  className={cn({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </button>
            ))}
          </div>
        )}
        {filteredPeople.length === 0 && (
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
  );
};
