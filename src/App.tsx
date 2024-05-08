import React, { useCallback, useState } from 'react';
import classNames from 'classnames';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedPeople = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  function handleItemClick(personToSelect: Person) {
    setSelectedPerson(personToSelect);
    setQuery(personToSelect.name);
    setAppliedQuery(personToSelect.name);
  }

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedPerson(null);
    applyQuery(event.target.value);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={() => setIsDropdownOpen(false)}
            />
          </div>

          {isDropdownOpen && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {selectedPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleItemClick(person)}
                    key={person.slug}
                  >
                    <p
                      className={classNames({
                        'has-text-link': person.sex === 'f',
                        'has-text-danger': person.sex === 'm',
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedPeople.length <= 0 && (
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
