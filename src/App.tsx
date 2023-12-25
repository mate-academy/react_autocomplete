import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './component/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {!selectedPerson
          ? 'No selected person'
          : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
      </h1>

      <Autocomplete
        people={peopleFromServer}
        onSelected={setSelectedPerson}
        delay={1000}
      />
    </main>
  );
};
