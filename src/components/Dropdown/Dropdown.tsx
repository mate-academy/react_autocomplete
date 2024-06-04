import React, { Dispatch, SetStateAction, useCallback } from 'react';

import { Person } from '../../types/Person';

import debounce from 'lodash.debounce';

interface Props {
  delay: number;
  visiblePeople: Person[];
  dropdownVisible: boolean;
  query: string;
  onSelected: (person: Person) => void;
  setSelectedPerson: Dispatch<SetStateAction<Person | null>>;
  setDropdownVisible: Dispatch<SetStateAction<boolean>>;
  setQuery: Dispatch<SetStateAction<string>>;
  setAppliedQuery: Dispatch<SetStateAction<string>>;
}

export const Dropdown: React.FC<Props> = ({
  delay,
  visiblePeople,
  dropdownVisible,
  query,
  onSelected,
  setSelectedPerson,
  setDropdownVisible,
  setQuery,
  setAppliedQuery,
}) => {
  const applyQuery = useCallback(
    debounce(inputQuery => {
      setDropdownVisible(true);
      setAppliedQuery(inputQuery);
    }, delay),
    [],
  );

  const onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setSelectedPerson(null);
    setQuery(newQuery.trimStart());
    applyQuery(newQuery.trim().toLowerCase());
  };

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={onQueryChange}
            onFocus={() => setDropdownVisible(true)}
          />
        </div>

        {dropdownVisible && visiblePeople.length > 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {visiblePeople.map((person: Person) => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => onSelected(person)}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {visiblePeople.length === 0 && (
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
