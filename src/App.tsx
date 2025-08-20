import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import Autocomplete from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  function handleSelectUser(user: Person | null) {
    setSelectedUser(user);
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedUser && (
          <h1 className="title" data-cy="title">
            {`${selectedUser?.name} (${selectedUser?.born} - ${selectedUser?.died})`}
          </h1>
        )}
        {!selectedUser && (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}
        <Autocomplete
          people={peopleFromServer}
          delay={300}
          onSelected={handleSelectUser}
          selectedUser={selectedUser}
        />
      </main>
    </div>
  );
};
