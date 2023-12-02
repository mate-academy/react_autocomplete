import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

const SEARCH_DELAY = 1000;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPeron] = useState<Person | null>(null);

  const personInfo = `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`;

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? personInfo : 'No selected person'}
      </h1>

      <Autocomplete
        people={peopleFromServer}
        onSelected={setSelectedPeron}
        delay={SEARCH_DELAY}
      />
    </main>
  );
};
