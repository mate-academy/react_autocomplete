import React, { useCallback, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isfocus, setIsfocus] = useState(false);

  const filteredPeople = peopleFromServer
    .filter(person => person.name.toLowerCase().includes(
      appliedQuery.toLowerCase(),
    ));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleClick = (name: string) => {
    setQuery(name);
  };

  const filterdPerson: Person | undefined
    = peopleFromServer.find(person => person.name === query);

  return (
    <main className="section">
      {filterdPerson && (
        <h1 className="title">
          {`${filterdPerson.name} (${filterdPerson.born} = ${filterdPerson.died})`}
        </h1>
      )}

      <div className={cn('dropdown', { 'is-active': isfocus })}>
        <div className="dropdown-trigger">
          <input
            value={query}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleQueryChange}
            onFocus={() => setIsfocus(true)}
            onBlur={() => setIsfocus(false)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length > 1
              ? (filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.name}
                  onMouseDown={() => handleClick(person.name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleClick(person.name);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              )))
              : (
                <div className="dropdown-item">
                  <p>No matching suggestions</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </main>
  );
};
