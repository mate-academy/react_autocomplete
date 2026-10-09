import React, { useState } from 'react';
import './App.scss';
import { Autocomplete } from './Autocomplete';
import { Person } from './types/Person';

type AppProps = {
  delay?: number;
};

export const App: React.FC<AppProps> = ({ delay = 300 }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>
        <Autocomplete onSelected={setSelectedPerson} delay={delay} />
      </main>
    </div>
  );
};
