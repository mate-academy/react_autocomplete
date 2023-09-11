import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

const DELAY_MS = 1000;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      {selectedPerson
        ? (
          <h1 className="title">
            {`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
          </h1>
        ) : (
          <h1>No selected person</h1>
        )}

      <Dropdown
        people={peopleFromServer}
        delay={DELAY_MS}
        onSelected={setSelectedPerson}
      />

    </main>
  );
};
