import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

const DELAY = 1000;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <Autocomplete
        people={peopleFromServer}
        onPersonSelected={handlePersonSelect}
        delay={DELAY}
      />
    </main>
  );
};
