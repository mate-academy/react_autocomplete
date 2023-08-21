import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './Components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [titlePerson, setTitlePerson] = useState<Person | null>(null);

  const selectTitlePerson = (person: Person) => {
    setTitlePerson(person);
  };

  return (
    <main className="section">
      {titlePerson
        ? (
          <h1 className="title">
            {`${titlePerson.name} (${titlePerson.born} - ${titlePerson.died})`}
          </h1>
        )
        : (
          <h1 className="title">
            No selected person
          </h1>
        )}

      <Autocomplete
        people={peopleFromServer}
        onSelected={selectTitlePerson}
      />
    </main>
  );
};
