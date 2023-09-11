import React, { useState, useCallback } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  const getSelectedUser = useCallback((person: Person) => (
    setSelectedUser(person)
  ), []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedUser
          ? `${selectedUser.name} (${selectedUser.born} = ${selectedUser.died})`
          : 'No selected person'}
      </h1>
      <Autocomplete getSelectedUser={getSelectedUser} />
    </main>
  );
};
