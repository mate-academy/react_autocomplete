import React, { useState } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import './App.scss';
import { DropList } from './components/DropList';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {
          selectedPerson ? (
            `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          ) : (
            'No selected person'
          )
        }
      </h1>

      <DropList
        people={peopleFromServer}
        delay={1000}
        onSelected={setSelectedPerson}
      />
    </main>
  );
};
