import React, { useState } from 'react';
import './App.scss';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';
import { PersonInfo } from './components/PersonInfo';
import { Placeholder } from './components/Placeholder';

const DELAY = 1000;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      {
        selectedPerson
          ? <PersonInfo person={selectedPerson} />
          : <Placeholder />
      }

      <Dropdown
        people={peopleFromServer}
        setSelectedPerson={setSelectedPerson}
        delay={DELAY}

      />
    </main>
  );
};
