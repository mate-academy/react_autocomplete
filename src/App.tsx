import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  const handleSelectedUser = (person: Person) => {
    setSelectedUser(person);
    setQuery(person.name);
  };

  const debouncedApplyQuery = useMemo(
    () => debounce((q: string) => setAppliedQuery(q.toLowerCase().trim()), 300),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    setSelectedUser(null);
    debouncedApplyQuery(value);
  };

  const filteredUsers = useMemo(() => {
    return peopleFromServer.filter(user =>
      user.name.toLowerCase().includes(appliedQuery),
    );
  }, [appliedQuery]);

  const showNoSuggestions = appliedQuery !== '' && filteredUsers.length === 0;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedUser
            ? `${selectedUser.name} (${selectedUser.born} - ${selectedUser.died})`
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
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredUsers.map(user => (
                <div
                  key={user.name}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelectedUser(user)}
                >
                  <p
                    className={
                      user.sex === 'f' ? 'has-text-danger' : 'has-text-link'
                    }
                  >
                    {user.name}
                  </p>
                </div>
              ))}

              {showNoSuggestions && (
                <div
                  className={`
                    notification is-danger is-light
                    mt-3 is-align-self-flex-start
                  `}
                  role="alert"
                  data-cy="no-suggestions-message"
                >
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
