import React, { useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPreson, setSelectedPerson] = useState<Person | null>(null);

  const onSelected = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPreson
            ? `${selectedPreson?.name} (${selectedPreson?.born} - ${selectedPreson?.died})`
            : 'No selected person'}
        </h1>
        <Autocomplete onSelect={onSelected} />
      </main>
    </div>
  );
};
