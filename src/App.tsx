import './App.scss';

import React, { useState } from 'react';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const getSelectedPerson = (person: Person) => (
    setSelectedPerson(person)
  );

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born}) - (${selectedPerson.died})`
        ) : 'No selected person'}
      </h1>

      <Autocomplete
        onSelected={getSelectedPerson}
        delay={800}
      />

    </main>
  );
};
