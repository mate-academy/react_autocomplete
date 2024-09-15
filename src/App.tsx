import React from 'react';
import './App.scss';
import { useState } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from '../src/types/Person';
import { Autocomplete } from './Autocomplete';

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelected = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleClearSelection = () => {
    setSelectedPerson(null);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
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
