import React, { useMemo, useState } from 'react';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';
import debounce from 'lodash.debounce';
import cn from 'classnames';

type Props = {
  onSelected?: (person: Person | null) => void;
  setSelectedPerson: (person: Person) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  onSelected,
  setSelectedPerson,
  delay = 300,
}) => {
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const applyQuery = debounce(setAppliedQuery, delay);

  const filterPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase()),
    );
  }, [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsDropdownOpen(true);
    onSelected?.(null);
  };

  const handlePersonClick = (person: Person) => {
    setIsDropdownOpen(false);
    setSelectedPerson(person);
    setQuery(person.name);
    onSelected?.(person);
  };

  const handleFocus = () => {
    setIsDropdownOpen(true);
  };

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
          onFocus={handleFocus}
        />
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {!!filterPeople.length ? (
            <div className="dropdown-content">
              {filterPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  onClick={() => handlePersonClick(person)}
                >
                  <p
                    className={cn({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
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
      )}
    </div>
  );
};
