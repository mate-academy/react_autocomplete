import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);
  const delay = 1000;

  return (
    <main className="section">
      <h1 className="title">
        {selectedUser
          ? <p>{`${selectedUser.name} (${selectedUser.born} - ${selectedUser.died})`}</p>
          : 'No selected person'}
      </h1>
      <Dropdown
        users={peopleFromServer}
        delay={delay}
        onSelected={setSelectedUser}
      />
    </main>
  );
};
