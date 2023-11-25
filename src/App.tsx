import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete/Autocomplete';

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];

  const [person, setPerson] = useState<Person | null>();
  return (
    <main className="section">
      <h1 className="title">
        {
          person
            ? `${person.name} (${person.born} = ${person.died})`
            : 'No selected person'
        }
      </h1>

      <Autocomplete 
        people={peopleFromServer}
        setPerson={setPerson}
        delay={1000}
      />

    </main>
  );
};
