import React from 'react';
import './App.scss';
import { useState } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from '../src/types/Person';
import { Autocomplete } from './Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelected = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleClearSelection = () => {
    setSelectedPerson(null);
  };

  const personInfo = selectedPerson
  ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {personInfo}
        </h1>
        <Autocomplete
          persons={peopleFromServer}
          onClearSelection={handleClearSelection}
          onSelected={handleSelected}
        />
      </main>
    </div>
  );
};
