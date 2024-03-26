import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  const handleSelect = (user: Person | null) => setSelectedUser(user);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedUser
            ? `${selectedUser.name} (${selectedUser.born} - ${selectedUser.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete onSelect={handleSelect} delay={1000} />
      </main>
    </div>
  );
};
