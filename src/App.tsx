import React, { useState } from 'react';
import './App.scss';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

export const App: React.FC = () => {
  const [selectedHuman, setSelectedHuman] = useState<Person | null>(null);

  const onSelect = (person: Person) => (
    setSelectedHuman(person)
  );

  return (
    <main className="section">
      <h1 className="title">
        {selectedHuman
          ? `${selectedHuman.name} (${selectedHuman.born} = ${selectedHuman.died})`
          : 'No selected person'}
      </h1>

      <Dropdown
        persons={peopleFromServer}
        onSelect={onSelect}
      />
    </main>
  );
};
