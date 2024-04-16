import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focusedQuery, setFocusedQuery] = useState(false);
  const [highlatedPersons, setHighlatedPersons] = useState<Person[]>([]);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredNames = useMemo(() => {
    return peopleFromServer.filter(
      (person) => person.slug.includes(appliedQuery.trim().toLowerCase())
    );
  }, [appliedQuery]);

  const handleClick = (person: Person) => {
    setFocusedQuery(true);
    setHighlatedPersons((prev) => [...prev, person]);
    // console.log(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${query} `}
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
              onFocus={() => setFocusedQuery(true)}
              onBlur={() => setFocusedQuery(false)}
            />
          </div>

          {focusedQuery && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredNames.map((person) => {
                  const thatPerson = highlatedPersons.some((man) =>
                    man.slug === person.slug
                  );

                  return (
                    <div
                      key={person.slug}
                      onClick={() => handleClick(person)}
                      className={`dropdown-item is-clickable ${thatPerson && 'is-active'}`}
                      data-cy="suggestion-item"
                    >
                      <p className={`has-text-${thatPerson ? 'danger' : 'link'}`}>
                        {person.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {filteredNames.length === 0 && (
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
