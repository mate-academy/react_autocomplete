import React, { useState } from 'react';
import { Autocomplete } from './components';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import './App.scss';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        people={peopleFromServer}
        delay={200}
        onSelected={(person) => {
          setSelectedPerson(person);
        }}
      />
    </main>
  );
};
