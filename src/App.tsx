import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import cn from 'classnames';
import debounce from 'lodash.debounce';

function filterPeople(cleanQuery: string) {
  return peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(cleanQuery),
  );
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isVisibleDropDown, setIsVisibleDropDown] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const filteredPeople = useMemo(() => {
    return filterPeople(appliedQuery);
  }, [appliedQuery]);

  const handlePeopleClick = (perosn: Person) => {
    setSelectedPerson(perosn);
    setIsVisibleDropDown(false);
    setQuery(perosn.name);
    setAppliedQuery(perosn.name.toLowerCase());
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);

    const newQleanQuery = newQuery.toLowerCase().trim();

    setIsVisibleDropDown(true);
    if (newQleanQuery.length > 0) {
      applyQuery(newQleanQuery);
    }
    setSelectedPerson(null);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={event => handleQueryChange(event.target.value)}
              onFocus={() => setIsVisibleDropDown(true)}
            />
          </div>

          {isVisibleDropDown && filteredPeople.length && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handlePeopleClick(person)}
                  >
                    <p
                      className={cn({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
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

        {!filteredPeople.length && (
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
