import React, { useState } from 'react';
import { Person } from './types/Person';
import './App.scss';
import DropdownInput from './components/DropdownInput';
import Title from './components/Title';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <Title selectedPerson={selectedPerson} />
      <DropdownInput onPersonSelected={setSelectedPerson} />
    </main>
  );
};
