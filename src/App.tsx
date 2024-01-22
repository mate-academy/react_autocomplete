import React, { useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const { name, born, died } = selectedPerson || {};

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${name} (${born} = ${died})`
          : 'No selected person'}

      </h1>
      <Autocomplete
        setSelectedPerson={setSelectedPerson}
      />
    </main>
  );
};
