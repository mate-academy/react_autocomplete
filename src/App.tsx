import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import './App.scss';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focusedQuery, setFocusedQuery] = useState(false);
  const [highlatedPerson, setHighlatedPerson] = useState<Person | null>(null);

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
    setQuery(person.name);
    setFocusedQuery(true);
    setHighlatedPerson(person);
    console.log(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {highlatedPerson
            ? `${highlatedPerson?.name} (${highlatedPerson?.born} - ${highlatedPerson?.died})`
            : 'No selected person'
          }
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
              onBlur={() => setTimeout(() => setFocusedQuery(false), 300)}
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
                  const thatPerson = highlatedPerson?.slug === person.slug;

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
