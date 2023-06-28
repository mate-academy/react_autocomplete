import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropDownMenu } from './components/DropDownMenu';
import { debounce } from './helpers';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedUserSlug, setSelectedUserSlug] = useState('');

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const visiblePeople = useMemo(() => {
    return peopleFromServer.filter(person => {
      return person.name
        .toLowerCase()
        .includes(appliedQuery
          .toLowerCase().trim());
    });
  }, [peopleFromServer, appliedQuery]);

  const selectedUser = useMemo(() => {
    return peopleFromServer.find(user => (
      user.slug === selectedUserSlug
    )) || null;
  }, [selectedUserSlug]);

  const handleUserSelect = (userSlug: string, username: string) => {
    setSelectedUserSlug(userSlug);
    setQuery(username);
    setAppliedQuery('');
  };

  const handleQueryChange = (value: string) => {
    setAppliedQuery('');
    setQuery(value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedUser
          ? `${selectedUser.name} (${selectedUser.born} = ${selectedUser.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={(event) => {
              applyQuery(event.target.value);
              handleQueryChange(event.target.value);
            }}
          />
        </div>

        {appliedQuery && (
          <DropDownMenu
            persons={visiblePeople}
            onSelected={handleUserSelect}
          />
        )}
      </div>
    </main>
  );
};
