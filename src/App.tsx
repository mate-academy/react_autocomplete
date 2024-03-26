import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [activePerson, setActivePerson] = useState<Person | null>(null);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  // const [isInputActive, setIsInputActive] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const clickOnButton = () => {
    setIsDropdownActive(!isDropdownActive);
  };

  const changePerson = (selectedPerson: Person) => {
    setActivePerson(selectedPerson);
    clickOnButton();
    setQuery(selectedPerson.name);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    if (newQuery.length < query.length) {
      setActivePerson(null);
    }

    setQuery(newQuery);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const emptyList = !filteredPeople.length;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {activePerson
            ? `${activePerson.name} (${activePerson.born} - ${activePerson.died})`
            : 'No selected person'}
        </h1>

        <div className={cn('dropdown', { 'is-active': isDropdownActive })}>
          <div className="dropdown-trigger">
            <button
              className={cn('button', {
                'is-active': isDropdownActive,
              })}
              aria-haspopup="true"
              aria-controls="dropdown-menu"
              onClick={clickOnButton}
            >
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Enter a part of the name"
                  className="input"
                  data-cy="search-input"
                  value={query}
                  onChange={handleQueryChange}
                  onFocus={clickOnButton}
                />
                <span className="icon is-small">
                  <i className="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </div>
            </button>
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className={cn('dropdown-item', {
                    'is-active': person.name,
                  })}
                  data-cy="suggestion-item"
                  key={person.name}
                  onClick={() => changePerson(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {emptyList && (
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
