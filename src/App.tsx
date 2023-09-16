import './App.scss';
import React, { useState } from 'react';
import { Person } from './types/Person';
import { DropMenu } from './components/DropMenu';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">

      <h1 className="title">
        {
          selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'
        }
      </h1>

      <DropMenu delay={1000} onSelected={setSelectedPerson} />
    </main>
  );
};
