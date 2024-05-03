import React, { useCallback, useState, useMemo } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(true);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setSelectedPerson(null);
    setQuery(newQuery.trimStart());
    applyQuery(newQuery.trim().toLowerCase());
  };

  const onSelected = (person: Person) => {
    setSelectedPerson(() => person);
    setDropdownVisible(() => false);
  };

  const visiblePeople: Person[] = useMemo(
    () =>
      peopleFromServer.filter(({ name }) =>
        name.toLowerCase().includes(appliedQuery),
      ),
    [appliedQuery],
  );

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
              onChange={onQueryChange}
              onFocus={() => setDropdownVisible(true)}
            />
          </div>

          {dropdownVisible && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
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
      </main>
    </div>
  );
};
