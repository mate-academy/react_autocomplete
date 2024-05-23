import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { CustomAutocomplete } from './components/autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleInputChange = () => {
    setSelectedPerson(null);
  };

  const headerText = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title" key={selectedPerson?.slug}>
          {headerText}
        </h1>
        <CustomAutocomplete
          peopleFromServer={peopleFromServer}
          onSelected={handleSelectedPerson}
          onInputChange={handleInputChange}
        />
      </main>
    </div>
  );
};
