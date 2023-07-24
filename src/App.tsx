import React, { useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
  };

  const delay = 500;

  return (
    <div className="App">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} - (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        onSelected={handlePersonSelect}
        delay={delay}
      />
    </div>
  );
};
