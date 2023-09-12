import React, { useState } from 'react';
import './App.scss';
import SelectedTitle from './components/SelectedTitle/SelectedTitle';
import { Person } from './types/Person';
import PersonsDropDown from './components/PersonsDropDown/PersonsDropDown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <SelectedTitle
        person={selectedPerson}
      />

      <PersonsDropDown
        setSelectedPerson={setSelectedPerson}
        delay={100}
      />
    </main>
  );
};
