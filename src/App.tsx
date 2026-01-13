import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import Autocomplete from './components/Autocomplete/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const delay: number = 0;

  const onSelected = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          <h1 className="title" data-cy="title">
            {selectedPerson.name} ({selectedPerson.born} - {selectedPerson.died}
            )
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <Autocomplete
          delay={delay}
          people={peopleFromServer}
          onSelected={onSelected}
        />
      </main>
    </div>
  );
};
