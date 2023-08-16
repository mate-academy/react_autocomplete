import React, { useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const delay = 1000;

  const title = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <main className="section">
      <h1 className="title">
        {title}
      </h1>

      <Autocomplete
        setSelectedPerson={setSelectedPerson}
        delay={delay}
      />

    </main>
  );
};
