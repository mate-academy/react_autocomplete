import React, { useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocompleted';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${name} (${born} - ${died})`
        ) : 'No selected person'}
      </h1>

      <Autocomplete
        people={peopleFromServer}
        timer={1000}
        onSelect={setSelectedPerson}
        selectPerson={name}
      />
    </main>
  );
};
