import React, { useState } from 'react';
import './App.scss';
import { DropdownMenu } from './components/DropdownMenu/DropdownMenu';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedUser
          ? `${selectedUser?.name} (${selectedUser?.born} - ${selectedUser?.died})`
          : 'No selected person'}
      </h1>

      <DropdownMenu
        onUserSelection={setSelectedUser}
        delay={1000}
      />
    </main>
  );
};
