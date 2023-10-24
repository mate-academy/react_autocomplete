import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components';

const DELAY = 1000;

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);

  const personInfo = `${person?.name} (${person?.born} - ${person?.died})`;

  return (
    <main className="section">
      <h1 className="title">
        {person ? personInfo : 'No selected person'}
      </h1>
      <Autocomplete
        people={peopleFromServer}
        onSelected={setPerson}
        delay={DELAY}
      />
    </main>
  );
};
