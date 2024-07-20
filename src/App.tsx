import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const [query, setQuery] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const filterList = peopleFromServer.filter(people =>
    people.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  //#region handle
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
    setQuery(event.target.value);
    setIsDropdownActive(true); // Активируем выпадающий список при изменении запроса
    if (event.target.value === '') {
      setSelectedPerson(null); // Устанавливаем выбранного человека в null, если поле ввода пустое
    }
  };

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    people: Person,
  ) => {
    e.preventDefault();
    setSelectedPerson(people);
    setIsDropdownActive(false);
  };
  //#endregion

  //#region press input
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownActive(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownActive(prev => !prev);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  //#endregion

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}
          data-cy="dropdown"
        >
          <div className="dropdown-trigger" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onClick={toggleDropdown}
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setIsDropdownActive(true)}
            />
          </div>
          <div
            className="dropdown-menu"
            id="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
          >
            <div className="dropdown-content">
              {filterList.map(people => (
                <a
                  key={people.slug}
                  href="#"
                  className="dropdown-item is-activ"
                  data-cy="suggestion-item"
                  onClick={e => handleClick(e, people)}
                >
                  {people.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {filterList.length === 0 && (
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
      </main>
    </div>
  );
};
