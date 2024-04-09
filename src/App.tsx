import React, { useCallback, useMemo, useState } from 'react';
import { Person } from './types/Person';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [appliedHuman, setAppliedHuman] = useState<Person | null>(null);
  const [inputFocused, setInputFocused] = useState(false);

  const people = [...peopleFromServer];

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const filteredPeople = useMemo(() => {
    return people.filter(human => human.name.includes(appliedQuery.trim()));
  }, [people, appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setAppliedHuman(null);
  };

  const handleHumanApplied = (person: Person) => {
    setQuery('');
    applyQuery('');
    setAppliedHuman(person);
    setInputFocused(false);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {appliedHuman
            ? `${appliedHuman.name} (${appliedHuman.born} - ${appliedHuman.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              value={query}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleQueryChange}
              onFocus={handleInputFocus}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {inputFocused && (
              <div className="dropdown-content">
                {filteredPeople.map(human => {
                  return (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={human.slug}
                      onClick={() => handleHumanApplied(human)}
                    >
                      <p
                        className={classNames({
                          'has-text-link': true,
                          'has-text-danger': false,
                        })}
                      >
                        {human.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {(appliedQuery && filteredPeople.length === 0) && (
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
