import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson === null ? (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          </h1>
        )}
        <Autocomplete
          persons={peopleFromServer}
          delay={300}
          onSelected={setSelectedPerson}
        />
      </main>
    </div>
  );
};
