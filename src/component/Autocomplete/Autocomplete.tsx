import React, { useState, useMemo } from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  peopleList: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  peopleList,
  onSelected = () => {},
  delay = 300,
}) => {
  const [search, setSearch] = useState('');
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const applySearchQuery = debounce(setAppliedSearchQuery, delay);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    applySearchQuery(e.target.value);
    onSelected(null);
  };

  const handleClick = (selectedPerson: Person) => {
    setSearch(selectedPerson.name);
    setAppliedSearchQuery(selectedPerson.name);
    onSelected(selectedPerson);
    setToggleDropdown(false);
  };

  const filteredPeople = useMemo(() => {
    return peopleList.filter(person =>
      person.name
        .toLowerCase()
        .includes(appliedSearchQuery.toLowerCase().trim()),
    );
  }, [appliedSearchQuery, peopleList]);

  return (
    <>
      <div className={`dropdown ${toggleDropdown ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onFocus={() => setToggleDropdown(true)}
            onBlur={() => setToggleDropdown(false)}
          />
        </div>

        {filteredPeople.length > 0 && (
          <div
            className="dropdown-menu is-active"
            role="menu"
            data-cy="suggestions-list"
          >
            <ul className="dropdown-content">
              {filteredPeople.map(people => (
                <li
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={people.name}
                  onMouseDown={() => {
                    setSearch(people.name);
                    handleClick(people);
                  }}
                >
                  <p className="has-text-link">{people.name}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

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
    </>
  );
};
