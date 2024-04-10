import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Dropdown } from './dropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();

  const onPersonSelected = (person?: Person) => {
    setSelectedPerson(person);
  };

  const chosenPerson = () => {
    return selectedPerson
      ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
      : 'No selected person';
  };

  const handleInputChanged = () => {
    setSelectedPerson(undefined);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {chosenPerson()}
        </h1>

        <Dropdown onSelected={onPersonSelected} onInputChanged={handleInputChanged}/>
      </main>
    </div>
  );
};
