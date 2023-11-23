import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { DropdownInput } from './components/DropdownInput';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {person
          ? `${person.name} (${person.born} = ${person.died})`
          : 'No selected person'}
      </h1>
      <DropdownInput
        person={person}
        delay={1000}
        onSelect={setPerson}
      />
    </main>
  );
};
