import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { AutoComplete } from './components/AutoComplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const delay = 1000;

  return (
    <main className="section">
      <h1 className="title">
        {!selectedPerson ? 'No selected person' : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
      </h1>

      <AutoComplete
        people={peopleFromServer}
        selectedPerson={selectedPerson}
        onSelect={setSelectedPerson}
        delay={delay}
      />
    </main>
  );
};
