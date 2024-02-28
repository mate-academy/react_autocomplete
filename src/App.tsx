import React, { useState } from 'react';
import './App.scss';

import { AutoComplete } from './components/AutoComplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <main className="section">
      {selectedPerson ? (
        <h1 className="title" data-cy="title">
          {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>
      ) : (
        <h1 className="title" data-cy="title">
          No selected person
        </h1>
      )}

      <AutoComplete
        onSelected={handleSelectedPerson}
        delay={300}
      />
    </main>
  );
};
