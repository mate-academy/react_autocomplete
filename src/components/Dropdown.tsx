import { useMemo, useState } from 'react';
import { type DropdownType } from '../types/DropdownType';
import { type Person } from '../types/Person';
import classNames from 'classnames';
import React from 'react';
import debounce from 'lodash.debounce';

export const Dropdown: React.FC<DropdownType> = ({
  people,
  onSelected,
  delay,
}: DropdownType) => {
  const [inputSearch, setInputSearch] = useState('');
  const [searchedText, setSearchedText] = useState('');
  const [isActive, setIsActive] = useState(false);

  const filteredPeople = useMemo(() => {
    return people.filter(option =>
      option.name
        .toLowerCase()
        .trim()
        .includes(searchedText.toLowerCase().trim()),
    );
  }, [searchedText, people]);

  const applyInputSearch = useMemo(
    () => debounce(setSearchedText, delay),
    [delay, setSearchedText],
  );

  const handleInputSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyInputSearch(event.target.value);
    setInputSearch(event.target.value);
    onSelected(null);
  };

  const handleListOfName = (person: Person) => {
    setInputSearch(person.name);
    applyInputSearch(person.name);
    onSelected(person);
  };

  return (
    <>
      <div className={classNames('dropdown', { 'is-active': isActive })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onChange={handleInputSearch}
            value={inputSearch}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(option => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={option.slug}
                onMouseDown={() => handleListOfName(option)}
              >
                <p className="has-text-link">{option.name}</p>
              </div>
            ))}
          </div>
        </div>
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
          <p>No matching suggestions</p>
        </div>
      )}
    </>
  );
};
