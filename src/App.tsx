import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';

type DelayProp = {
  delay?: number;
};

export const App: React.FC<DelayProp> = ({ delay = 300 }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const title = [...peopleFromServer].find(person => person.name === query);

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredNames = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.includes(appliedQuery.trim()),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {title ? (
          <h1 className="title" data-cy="title">
            {`${title.name} (${title.born} - ${title.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            {`No selected person`}
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setFocused(true)}
            />
          </div>

          {filteredNames.length !== 0 && focused ? (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredNames.map(item => {
                  return (
                    <div
                      key={item.name}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      onClick={() => {
                        setQuery(item.name);
                        setAppliedQuery(item.name);
                      }}
                    >
                      <p className="has-text-link">{item.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            appliedQuery !== '' && (
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
            )
          )}
        </div>
      </main>
    </div>
  );
};
