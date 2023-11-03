import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './DropdownMenu';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>();
  const { name, born, died } = selectedPerson || {};

  const handleOnSelect = (person: Person) => (
    setSelectedPerson(person)
  );

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? `${name} (${born}) - (${died})` : 'No selected person'}
      </h1>
      <DropdownMenu
        people={peopleFromServer}
        onSelected={handleOnSelect}
        delay={800}
      />
    </main>
  );
};
