import React, { useState } from 'react';
import './App.scss';
import { PeopleList } from './components/PeopleList';
import { Person } from './types/Person';

const DEFAULT_DELAY = 300;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const currentTitle = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {currentTitle}
        </h1>

        <PeopleList
          delay={DEFAULT_DELAY}
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
        />
      </main>
    </div>
  );
};
