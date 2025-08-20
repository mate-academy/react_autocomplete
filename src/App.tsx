import React, { useCallback, useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { UserList } from './Components/UsersList';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuerry, setAppliedQuerry] = useState('');
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);
  const [person, setPerson] = useState<Person[] | Person>(peopleFromServer);
  const [hasError, setHasError] = useState(false);

  const handleSelectedUser = (user: Person) => {
    setSelectedUser(user);
    setQuery(user.name);
    setPerson([user]);
  };

  // const normalizeQuery = query.toLowerCase().trim();

  const applyQuery = useCallback(debounce(setAppliedQuerry, 300), []);

  const filteredUsers = useMemo(() => {
    return (person as Person[]).filter((user: Person) =>
      user.name.toLowerCase().trim().includes(appliedQuerry),
    );
  }, [appliedQuerry, person]);

  const handleQuerychange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setPerson(peopleFromServer);
  };

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
              onChange={handleQuerychange}
            />
          </div>

          <UserList users={filteredUsers} onSelectedUser={handleSelectedUser} />
        </div>

        {hasError && (
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
