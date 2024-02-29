import React, { useState } from 'react';
import './App.scss';

import { AutoComplete } from './components/AutoComplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person | null) => {
    setSelectedPerson(person);
  };

  const selectPerson = selectedPerson ? (
    `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
  ) : (
    'No selected person'
  );

  return (
    <main className="section">
      <h1 className="title" data-cy="title">
        { selectPerson }
      </h1>

      <AutoComplete
        onSelected={handleSelectedPerson}
        delay={300}
      />
    </main>
  );
};
