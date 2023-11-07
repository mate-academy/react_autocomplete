import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);
  const delay = 1000;

  return (
    <main className="section">
      <h1 className="title">
        {person
          ? `${person.name} (${person.born} = ${person.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete delay={delay} onSelected={setPerson} />
    </main>
  );
};
