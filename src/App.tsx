import './App.scss';
import React, { useState } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

const delay = 1000;

export const App: React.FC = () => {
  const [person, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = { ...person };

  return (
    <main className="section">
      <h1 className="title">
        {person ? (
          `${name} - (${born} - ${died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <Dropdown
        people={peopleFromServer}
        delay={delay}
        onSelect={setSelectedPerson}
      />

    </main>
  );
};
