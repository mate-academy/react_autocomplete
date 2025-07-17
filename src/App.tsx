import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson ? (
            `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
          ) : (
            <p>No selected person</p>
          )}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          delay={0}
          onSelected={setSelectedPerson}
        />
      </main>
    </div>
  );
};
