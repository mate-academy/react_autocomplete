import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { DropdownInput } from './components/DropdownInput';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};

  return (
    <main className="section">

      <h1 className="title">
        {selectedPerson
          ? `${name} (${born} - ${died})`
          : 'No selected person'}
      </h1>

      <DropdownInput onSelect={setSelectedPerson} />
    </main>
  );
};
