import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { People } from './components/People';

type Props = {
  delay: number
};

export const App: React.FC<Props> = ({ delay }) => {
  const [user, setUser] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');

  const timerId = useRef(0);

  const findUser = (username: string) => {
    return peopleFromServer.find(person => person.name === username);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser(event.target.value);
    window.clearTimeout(timerId.current);

    if (user.length <= 1) {
      setSelectedUser('');
    }

    timerId.current = window.setTimeout(() => {
      setAppliedQuery(event.target.value);
    }, delay);
  };

  const filteredUsers = useMemo(() => {
    if (!appliedQuery) {
      return peopleFromServer;
    }

    const users = peopleFromServer
      .filter(person => person.name.toLowerCase()
        .includes(appliedQuery.toLowerCase()));

    return users;
  }, [appliedQuery]);

  const handleSelectUser = useCallback((username: string) => {
    setUser(username);
    setSelectedUser(username);
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedUser
          ? `${findUser(selectedUser)?.name} (${findUser(selectedUser)?.born} = ${findUser(selectedUser)?.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={user}
            onChange={event => handleQueryChange(event)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 500)}
          />
        </div>

        <People
          people={filteredUsers}
          onSelected={handleSelectUser}
          isFocused={isFocused}
        />
      </div>
    </main>
  );
};
