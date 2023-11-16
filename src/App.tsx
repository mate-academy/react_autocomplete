import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSeletedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person' }
      </h1>

      <Autocomplete
        people={peopleFromServer}
        onSelected={setSeletedPerson}
        delay={1000}
      />
    </main>
  );
};
