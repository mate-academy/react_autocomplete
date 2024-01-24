import React, { useState } from 'react';
import './App.scss';
import { Dropdown } from './Components/Dropdown';
import { Person } from './types/Person';
import { ChosenPerson } from './Components/ChosenPerson';

export const App: React.FC = () => {
  const [
    selectedPerson,
    setSelectedPerson,
  ] = useState<Person | null>(null);

  return (
    <main className="section">
      {selectedPerson === null ? (
        <h1 className="title">
          No selected person
        </h1>
      ) : (
        <ChosenPerson person={selectedPerson} />
      )}

      <Dropdown setSelectedPerson={setSelectedPerson} />
    </main>
  );
};
