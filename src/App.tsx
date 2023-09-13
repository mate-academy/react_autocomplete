import React, { useState } from 'react';

import './App.scss';

import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson]
    = useState<Person | null>(null);

  const titleMessage = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <main className="section">
      <h1 className="title">
        {titleMessage}
      </h1>

      <Autocomplete
        setSelectedPerson={setSelectedPerson}
        delay={1000}
      />
    </main>
  );
};
