import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Autocomplete } from './components';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const DEBOUNCE_TIME = 300;

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
          : 'No selected person'}
      </h1>
      <Autocomplete
        setSelectedPerson={setSelectedPerson}
        DEBOUNCE_TIME={DEBOUNCE_TIME}
      />
    </main>
  );
};
