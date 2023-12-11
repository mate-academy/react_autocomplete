import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

function headerText(person: Person | null) {
  const title = person
    ? `${person.name} (${person.born} - ${person.died})`
    : 'No selected person';

  return title;
}

export const App: React.FC = () => {
  const [myPerson, setMyPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">{headerText(myPerson)}</h1>

      <Autocomplete
        peopleFromServer={peopleFromServer}
        setMyPerson={setMyPerson}
        delay={500}
      />
    </main>
  );
};
