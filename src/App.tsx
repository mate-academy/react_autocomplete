import React, { useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components';
import { Person } from './types/Person';

const persons = [...peopleFromServer];

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Dropdown
        persons={persons}
        onSelected={setSelectedPerson}
        delay={500}
      />
    </main>
  );
};
