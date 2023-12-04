import React, { useState } from 'react';

import './App.scss';
import Information from './components/Information/Information';
import { DropDownList } from './components/DropDownList/DropDownList';
import { Person } from './types/Person';

import { peopleFromServer } from './data/people';

const delay = 1000;

export const App: React.FC = () => {
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <Information
        currentPerson={currentPerson}
      />

      <DropDownList
        peopleList={peopleFromServer}
        setCurrentPerson={(person) => setCurrentPerson(person)}
        delay={delay}
      />
    </main>
  );
};
