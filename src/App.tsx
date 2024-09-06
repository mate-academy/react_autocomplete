import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { DropDown } from './Components/DropDown/DropDown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const selectPerson = (person: Person | null) => {
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

        <DropDown onSelected={selectPerson} delay={300} />
      </main>
    </div>
  );
};
