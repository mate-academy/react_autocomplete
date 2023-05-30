import React, { useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [user, setUser] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {user
          ? `${user.name} (${user.born} = ${user.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        delay={1000}
        onSelected={setUser}
      />
    </main>
  );
};
