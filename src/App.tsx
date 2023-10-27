import React, { useState } from 'react';
import './App.scss';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const onSelect = (person: Person) => (
    setSelectedPerson(person)
  );

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Dropdown
        persons={peopleFromServer}
        onSelect={onSelect}
      />
    </main>
  );
};
