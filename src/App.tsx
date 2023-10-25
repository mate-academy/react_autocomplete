import React, { useState, useCallback } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

const DEFAULT_DELAY = 700;

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  const onUserSelected = useCallback((person: Person) => (
    setSelectedUser(person)
  ), []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedUser
          ? `${selectedUser.name} (${selectedUser.born} - ${selectedUser.died})`
          : 'No selected person'}
      </h1>
      <Autocomplete onUserSelected={onUserSelected} delay={DEFAULT_DELAY} />
    </main>
  );
};
