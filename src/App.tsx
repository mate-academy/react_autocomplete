import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callBack: Function, delay: number) {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...arg: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => callBack(...arg), delay);
  };
}

export const App: React.FC = () => {
  const [dropdownOptions, setDropdownOptions] = useState(peopleFromServer);

  const [search, setSearch] = useState('');
  const [debounceSearch, setDebounceSearch] = useState('');

  const debonceSerch = debounce(setDebounceSearch, 300);

  const [dropdownOptionSelected, setDropdownOptionSelected] =
    useState<Person | null>(null);

  useEffect(() => {
    setDropdownOptions(() => {
      return debounceSearch.trim().length
        ? peopleFromServer.filter(({ name }) => name.includes(debounceSearch))
        : peopleFromServer;
    });
  }, [debounceSearch]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearch(value);
    debonceSerch(value);
    setDropdownOptionSelected(null);
  };

  const handleDropdownClick = (person: Person) => {
    setDropdownOptionSelected(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {dropdownOptionSelected
            ? `${dropdownOptionSelected.name} (${dropdownOptionSelected.born} - ${dropdownOptionSelected.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={search}
              onChange={handleChangeInput}
            />
          </div>

          {!!dropdownOptions.length && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {dropdownOptions.map(p => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={p.slug}
                    onClick={() => handleDropdownClick(p)}
                  >
                    <p className="has-text-link">{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!dropdownOptions.length && (
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

{
  /* <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Elisabeth Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter de Decker</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Petronella de Decker</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Elisabeth Hercke</p>
              </div> */
}
