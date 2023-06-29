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
      const name = person.name.toLowerCase();
      const searchedName = appliedQuery.toLowerCase().trim();

      return name.includes(searchedName);
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

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
    setAppliedQuery('');
    setQuery(event.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedUser?.name === query
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
            onChange={handleQueryChange}
          />
        </div>

        {appliedQuery && (
          <DropDownMenu
            persons={visiblePeople}
            onPersonSelect={handleUserSelect}
          />
        )}
      </div>
    </main>
  );
};
