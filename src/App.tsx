import React, { useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        list={peopleFromServer}
        onSelected={setSelectedPerson}
        delay={500}
      />
    </main>
  );
};
