import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';

import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

import './App.scss';

export const App: React.FC = () => {
  const [people, setPeople] = useState(peopleFromServer);
  const [activePerson, setActivePerson] = useState<Person | null>(null);
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');

  const searchQuery = useCallback(debounce(setAppliedQuery, 300), [
    setAppliedQuery,
  ]);

  useMemo(() => {
    const filteredPeople = peopleFromServer.filter((person: Person) =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );

    setPeople(filteredPeople);
  }, [appliedQuery]);

  const isNotPeople = people.length === 0;

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    searchQuery(event.target.value);
    if (query !== event.target.value) {
      setActivePerson(null);
    }
  };

  const onPersonClick = (person: Person) => {
    setPeople([]);
    setActivePerson(person);
    setQuery(person.name);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {activePerson &&
            activePerson.name === query &&
            `${activePerson.name} (${activePerson.born} - ${activePerson.died})`}
          {(!activePerson || activePerson.name !== query) &&
            `No selected person`}
        </h1>
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={onSearchChange}
            />
          </div>

          {!isNotPeople && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {people.map(person => (
                  <div
                    key={person.slug}
                    onClick={() => onPersonClick(person)}
                    className="dropdown-item"
                    data-cy="suggestion-item"
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
        {!activePerson && people.length === 0 && (
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
