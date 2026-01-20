import React from 'react';
import { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './Autocomplete/autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handlePersonSelected = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson === null
            ? 'No selected person'
            : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onSelected={handlePersonSelected}
        />
      </main>
    </div>
  );
};
