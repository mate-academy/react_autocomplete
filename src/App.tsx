import React, { useState } from 'react';
import './App.scss';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const title = `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`;

  const onSelected = (selected: Person) => {
    setSelectedPerson(selected);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? title : 'No selected person'}
      </h1>

      <Dropdown
        onSelected={onSelected}
        delay={1000}
      />
    </main>
  );
};
