import React, { useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">

      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
        ) : (
          'No selected person'
        )}

      </h1>

      <Autocomplete
        personList={peopleFromServer}
        onSelect={setSelectedPerson}
        delay={1000}
      />
    </main >
  );
};
