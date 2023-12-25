import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {
          person
            ? `${person.name} (${person.born} = ${person.died})`
            : 'No selected person'
        }
      </h1>

      <Dropdown people={peopleFromServer} setPerson={setPerson} delay={1000} />
    </main>
  );
};
