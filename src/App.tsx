import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Autocomplete } from './Components/Autocomplete/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const { name, born, died } = selectedPerson || {};

  const getSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${name} (${born}) - (${died})`
          : 'No selected Person'}
      </h1>

      <Autocomplete
        onSelect={getSelectedPerson}
        delay={500}
      />
    </main>
  );
};
