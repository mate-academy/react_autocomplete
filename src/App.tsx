import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import './App.scss';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocusedQuery, setIsFocusedQuery] = useState(false);
  const [highlightedPerson, setHighlightedPerson] = useState<Person|null>(null);
  const { name, born, died } = highlightedPerson || {};
  const clickedPerson =
    highlightedPerson && query.length !== 0
      ? `${name} (${born} - ${died})`
      : 'No selected person';

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);

    if (event.target.value.length === 0) {
      setHighlightedPerson(null);
    }
  };

  const filteredNames = useMemo(() => {
    return peopleFromServer.filter(
      (person) => person.name.toLowerCase().includes(
        appliedQuery.trim().toLowerCase()
      )
    );
  }, [appliedQuery]);

  const handleClick = (person: Person) => {
    setQuery(person.name);
    setIsFocusedQuery(true);
    setHighlightedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {clickedPerson}
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
              onFocus={() => setIsFocusedQuery(true)}
              onBlur={() => setTimeout(() => setIsFocusedQuery(false), 300)}
            />
          </div>

          {filteredNames.length !== 0 && (
            isFocusedQuery && (
              <div
                className="dropdown-menu"
                role="menu"
                data-cy="suggestions-list"
              >
                <div className="dropdown-content">
                  {filteredNames.map((person) => {
                    const thatPerson = highlightedPerson?.slug === person.slug;

                    return (
                      <div
                        key={person.slug}
                        onClick={() => handleClick(person)}
                        className={classNames(
                          'dropdown-item is-clickable',
                          { 'is-active': thatPerson }
                        )}
                        data-cy="suggestion-item"
                      >
                        <p className={classNames(
                          { 'has-text-danger': thatPerson },
                          { 'has-text-link': !thatPerson },
                        )}>
                          {person.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>

        {!filteredNames.length && (
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
