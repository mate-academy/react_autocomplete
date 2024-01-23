import React, { useState } from 'react';
import { Autocomplete } from './components';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import './App.scss';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const {
    name,
    born,
    died,
  } = selectedPerson || { name: '', born: '', died: '' };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${name} (${born} - ${died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        people={peopleFromServer}
        delay={1000}
        onSelected={setSelectedPerson}
      />
    </main>
  );
};
