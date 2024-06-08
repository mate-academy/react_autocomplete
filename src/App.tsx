import React, { useState } from 'react';
import './App.scss';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handlePersonTitleChange = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Dropdown
          onSelected={handlePersonTitleChange}
          delay={1000}
          selectedPerson={selectedPerson}
        />
      </main>
    </div>
  );
};
