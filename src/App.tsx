import React, { useState } from 'react';
import './App.scss';
import 'bulma';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './сomponents/Dropdown';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {person
          ? `${person.name} (${person.born} = ${person.died})`
          : 'No selected person'}
      </h1>

      <Dropdown
        people={peopleFromServer}
        changePerson={setPerson}
        debounceDelay={1000}
      />
    </main>
  );
};
