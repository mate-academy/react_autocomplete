//  eslint-disable

import React from 'react';
import { useState } from 'react';

import { AutoComplite } from './components/AutoComplite';
import { Person } from './types/Person';
import './App.scss';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person | null) => {
    setSelectedPerson(person);
  };

  const selectPerson = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectPerson}
        </h1>

        <AutoComplite onSelected={handleSelectedPerson} />
      </main>
    </div>
  );
};
