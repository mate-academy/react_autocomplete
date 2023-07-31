import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const onSelected = (person: Person) => {
    setSelectedPerson(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        delay={1000}
        onSelected={onSelected}
      />
    </main>
  );
};
