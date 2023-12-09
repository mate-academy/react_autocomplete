import React, { useState } from 'react';
import { Autocomplete } from './components/Autocomplete/Autocomplete';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person>(peopleFromServer[0]);
  const { name, born, died } = person;

  return (
    <main className="section">
      <h1 className="title">
        {`${name} (${born} = ${died})`}
      </h1>

      <Autocomplete
        options={peopleFromServer}
        getValue={(value) => setPerson(value)}
      />
    </main>
  );
};
