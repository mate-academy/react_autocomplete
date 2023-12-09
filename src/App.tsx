import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [myPerson, setMyPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {myPerson ? (
          `${myPerson.name} (${myPerson.born} - ${myPerson.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <Autocomplete
        peopleFromServer={peopleFromServer}
        setMyPerson={(person) => setMyPerson(person)}
        delay={500}
      />
    </main>
  );
};
