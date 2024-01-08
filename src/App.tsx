import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Title } from './components/Title/Title';
import { Person } from './types/Person';
import { Autocomplate } from './components/Autocomplate/Autocomplate';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [title, setTitle] = useState('');

  return (
    <main className="section">
      <Title
        person={selectedPerson}
        title={title}
      />

      <Autocomplate
        people={peopleFromServer}
        setSelectedPerson={setSelectedPerson}
        setTitle={setTitle}
      />
    </main>
  );
};
