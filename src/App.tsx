import './App.scss';
import React, { useState } from 'react';

import { Dropdown } from './Components/Dropdown/Dropdown';
import { PersonInfo } from './Components/PersonInfo/PersonInfo';
import { Person } from './types/Person';

const DELAY = 1000;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <PersonInfo selectedPerson={selectedPerson} />

      <Dropdown delay={DELAY} setSelectedPerson={setSelectedPerson} />
    </main>
  );
};
