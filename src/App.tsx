import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Display } from './data/components/Display';
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

      <Display
        people={peopleFromServer}
        onSelected={setSeletedPerson}
        delay={500}
      />

    </main>
  );
};
