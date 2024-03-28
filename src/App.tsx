import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

const DELAY = 300;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${name} (${born} - ${died})`
            : 'No selected person'}
        </h1>
        <Dropdown
          people={peopleFromServer}
          onSelected={setSelectedPerson}
          delay={DELAY}
        />
      </main>
    </div>
  );
};
