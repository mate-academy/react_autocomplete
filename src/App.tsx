import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Dropdown } from './Dropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (
            `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          ) : (
            'No selected person'
          )}
      </h1>

      <Dropdown
        onSelect={setSelectedPerson}
      />
    </main>
  );
};
