import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './Autocomplete/component';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-qa="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>
        <Autocomplete
          people={peopleFromServer}
          onSelected={handleSelectedPerson}
          selectedPerson={selectedPerson}
        />
      </main>
    </div>
  );
};
