import React, { useState } from 'react';
import { Autocomplete } from './components/Autocomplete/Autocomplete';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      {person && (
        <h1 className="title">
          {`${person.name} (${person.born} - ${person.died})`}
        </h1>
      )}

      <Autocomplete
        options={peopleFromServer}
        getValue={(value) => setPerson(value)}
      />
    </main>
  );
};
