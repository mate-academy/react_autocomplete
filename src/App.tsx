import React, { useState } from 'react';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';
import './App.scss';

export const App: React.FC = () => {
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person | null) => {
    setSelectPerson(person);
  };

  const clearPerson = () => {
    setSelectPerson(null);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectPerson ? (
          <h1 className="title" data-cy="title">
            {`${selectPerson.name} (${selectPerson.born} - ${selectPerson.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}
        <Autocomplete
          onSelectPerson={handleSelectedPerson}
          clearPerson={clearPerson}
        />
      </main>
    </div>
  );
};
