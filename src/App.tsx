import React, { useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const showPersonInfo =
    selectedPerson !== null
      ? `${selectedPerson.name} (${selectedPerson.born}-${selectedPerson.died})`
      : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {showPersonInfo}
        </h1>
        <Autocomplete onSelect={setSelectedPerson} />
      </main>
    </div>
  );
};
