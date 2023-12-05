import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/UI/Autocomplete/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [activePerson, setActivePerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {activePerson
          ? `${activePerson.name} (${activePerson.born} = ${activePerson.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        options={peopleFromServer}
        delay={1000}
        setActiveOption={setActivePerson}
      />
    </main>
  );
};
