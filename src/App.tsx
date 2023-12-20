import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

import { Person } from './types/Person';

import { Dropdown } from './component/Dropdown';

export const App: React.FC = () => {
  const [person, setPerson] = useState('No selected person');

  const handlePerson = (currentPerson: Person) => {
    setPerson(`${currentPerson.name} (${currentPerson.born} = ${currentPerson.died})`);
  };

  return (
    <main className="section">
      <h1 className="title">
        {person}
      </h1>

      <Dropdown people={peopleFromServer} onSort={handlePerson} />
    </main>
  );
};
