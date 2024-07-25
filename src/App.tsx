import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Autocomplete } from './Components';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          <h1 className="title" data-cy="title">
            {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            NO SELECTED PERSON
          </h1>
        )}

        <Autocomplete onSelect={setSelectedPerson} />
      </main>
    </div>
  );
};
