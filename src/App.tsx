import React, { useState } from 'react';
import './App.scss';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Title } from './components/Title';
import { Dropdown } from './components/Dropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson]
    = useState<Person>(peopleFromServer[0]);

  return (
    <main className="section">
      <Title person={selectedPerson} />

      <Dropdown
        people={peopleFromServer}
        selectedPerson={selectedPerson}
        onPersonSelect={setSelectedPerson}
        delay={1000}
      />
    </main>
  );
};
