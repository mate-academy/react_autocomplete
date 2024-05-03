import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectUser, setSelectUser] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [dropDown, setDropDown] = useState(false);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectUser(null);
    setQuery(event.target.value);
  };

  const handleSelectUser = (user: Person) => {
    setSelectUser(user);
    setDropDown(false);
  };

  const filter = peopleFromServer.filter(user => {
    const normName = user.name.trim().toLowerCase();
    const normQuery = query.trim().toLowerCase();

    return normName.includes(normQuery);
  });

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectUser
            ? `${selectUser.name} (${selectUser.born} - ${selectUser.died})`
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
              onChange={handleQuery}
              onFocus={() => setDropDown(true)}
            />
          </div>

          {dropDown && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filter.map(user => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={user.slug}
                    onClick={() => handleSelectUser(user)}
                  >
                    {user.sex === 'm' ? (
                      <p className="has-text-link">{user.name}</p>
                    ) : (
                      <p className="has-text-danger">{user.name}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {filter.length === 0 && (
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
