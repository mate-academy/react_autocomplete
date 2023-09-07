import React, { useCallback, useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  const onSelectUser = useCallback((user: Person | null) => {
    setSelectedUser(user);
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedUser
          ? (
            `${selectedUser?.name} (${selectedUser?.born} = ${selectedUser?.died})`
          )
          : 'No selected person'}
      </h1>

      <Autocomplete
        users={peopleFromServer}
        onSelect={onSelectUser}
        delay={1000}
      />
    </main>
  );
};
