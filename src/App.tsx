import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
  };

  const clearSelectedPerson = () => {
    setSelectedPerson(null);
  };

  const dropdownTitle = () => {
    return selectedPerson
      ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
      : 'No selected person';
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {dropdownTitle()}
        </h1>
        <Autocomplete
          onSelected={handleSelectedPerson}
          people={peopleFromServer}
          clearSelectedPerson={clearSelectedPerson}
        />
      </main>
    </div>
  );
};
