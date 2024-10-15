import React, { useState } from 'react';
import './App.scss';
import { Dropdown } from './Dropdown/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const title = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <Dropdown
          onSelected={setSelectedPerson}
          delay={300}
          selectedPerson={selectedPerson}
        />
      </main>
    </div>
  );
};
