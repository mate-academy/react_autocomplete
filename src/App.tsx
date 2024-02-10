import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Autocomplite } from './components';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const { name, born, died } = selectedPerson || {};

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${name} (${born} - ${died})`
            : 'Person is not selected'}
        </h1>

        <Autocomplite
          onSelectedPerson={setSelectedPerson}
          delay={300}
        />
      </main>
    </div>
  );
};
