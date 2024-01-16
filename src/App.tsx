import React, { useState } from 'react';
import './App.scss';
import { Autocomplete } from './Autocomplete';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>();

  return (
    <main className="section">
      <h1 className="title">
        {
          person
            ? `${person.name} (${person.born} - ${person.died})`
            : 'No selected person'
        }
      </h1>

      <Autocomplete
        people={peopleFromServer}
        onSelected={setPerson}
        delay={1000}
      />
    </main>
  );
};
