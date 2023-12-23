import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

import { Person } from './types/Person';

import { Dropdown } from './component/Dropdown';

export const App: React.FC = () => {
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {currentPerson
          ? `${currentPerson.name} ${currentPerson.born} - ${currentPerson.died}`
          : 'No person selected'}
      </h1>

      <Dropdown
        people={peopleFromServer}
        setPerson={setCurrentPerson}
      />
    </main>
  );
};
