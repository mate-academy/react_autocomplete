import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomlete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [newPerson, setNewPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {newPerson
          ? `${newPerson.name} (${newPerson.born} = ${newPerson.died})`
          : 'No selected person.'}
      </h1>

      <Autocomlete
        people={peopleFromServer}
        setNewPerson={setNewPerson}
        delay={500}
      />
    </main>
  );
};
