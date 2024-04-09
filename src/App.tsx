import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './Components/Dropdown';
import { Person } from './types/Person';

const delay = 300;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};

  const emptySelectedPerson = 'No selected person';
  const selectedPersonStr = `${name} (${born} - ${died})`;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson ? selectedPersonStr : emptySelectedPerson}
        </h1>

        <Dropdown
          peoples={peopleFromServer}
          onSelected={setSelectedPerson}
          delay={delay}
        />
      </main>
    </div>
  );
};
