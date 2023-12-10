import React, { useState } from 'react';

import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState <Person | undefined>(
    undefined,
  );

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>
      <Autocomplete
        peopleList={peopleFromServer}
        onSelect={setSelectedPerson}
        delay={1000}
      />
    </main>
  );
};
