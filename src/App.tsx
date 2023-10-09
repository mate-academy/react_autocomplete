import React, { useState } from 'react';
import './App.scss';
import { People } from './components/People';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>
      <People
        people={peopleFromServer}
        onSelected={setSelectedPerson}
      />
    </main>
  );
};
