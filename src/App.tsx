import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [newPerson, setNewPerson] = useState<Person | null>(null);

  const getNewPerson = (person: Person) => {
    setNewPerson(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {newPerson ? (
          `${newPerson?.name} (${newPerson?.born} = ${newPerson.died})`
        ) : 'No selected person'}
      </h1>

      <Autocomplete
        onSelected={getNewPerson}
        delay={800}
      />
    </main>
  );
};
