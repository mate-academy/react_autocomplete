import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [dropDown, setDropDown] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
    setDropDown(true);
  };

  const handleSelectPerson = (person: Person) => {
    setQuery(person?.name);
    setSelectedPerson(person);
    setDropDown(false);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => {
      const normalazedName = person.name.trim().toLowerCase();
      const normalazedQuery = appliedQuery.trim().toLowerCase();

      return normalazedName.includes(normalazedQuery);
    });
  }, [appliedQuery]);

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
              onFocus={() => {
                setDropDown(true);
              }}
            />
          </div>

          {dropDown && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div
                className={
                  filteredPeople.length !== 0 ? 'dropdown-content' : ''
                }
              >
                {filteredPeople.map(people => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={people.slug}
                    onClick={() => handleSelectPerson(people)}
                  >
                    <p
                      className={classNames('has-text-link', {
                        'has-text-danger': people.sex === 'f',
                      })}
                    >
                      {people.name}
                    </p>
                  </div>
                ))}
              </div>
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
      </main>
    </div>
  );
};
