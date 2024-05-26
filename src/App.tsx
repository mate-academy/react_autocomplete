import React, { useState } from 'react';
import './App.scss';
import { Autocomplete } from './Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | ''>('');

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} ${selectedPerson.born} - ${selectedPerson.died}`
          : 'No selected person'}
      </h1>

      <Autocomplete
        onSelect={setSelectedPerson}
        delay={1000}
      />
    </main>
  );
};
