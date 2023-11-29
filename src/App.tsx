import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {currentPerson ? (
          `${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <Autocomplete
        onSelect={setCurrentPerson}
        delay={500}
      />
    </main>
  );
};
