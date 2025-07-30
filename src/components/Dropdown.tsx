import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';
import classNames from 'classnames';

type Props = {
  peopleData: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
  selectedPerson: Person | null;
};

export const Dropdown: React.FC<Props> = ({
  peopleData,
  delay = 300,
  onSelected,
  selectedPerson,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [dropdownFocus, setDropDownFocus] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    applyQuery(value);

    if (selectedPerson && value !== selectedPerson?.name) {
      onSelected(null);
    }
  };

  const handleSelcted = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    setDropDownFocus(false);
    onSelected(person);
  };

  const people = [...peopleData].sort((a, b) => a.name.localeCompare(b.name));

  const filterPeople = useMemo(() => {
    return people.filter(person => person.name.includes(appliedQuery));
  }, [appliedQuery, people]);

  return (
    <>
      <div className={classNames('dropdown', { 'is-active': dropdownFocus })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onClick={() => setDropDownFocus(true)}
            onBlur={() => {
              setTimeout(() => {
                setDropDownFocus(false);
              }, 100);
            }}
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filterPeople.map(person => {
              return (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  onClick={() => handleSelcted(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {dropdownFocus && filterPeople.length === 0 && (
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
