import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const onSelect = (person:Person) => {
    setSelectedPerson(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
          : ('No selected person')}

      </h1>
      <Dropdown
        people={peopleFromServer}
        delay={1000}
        onSelect={onSelect}
      />
    </main>
  );
};
