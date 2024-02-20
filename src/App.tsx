import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const handleSelect = (person: Person | null) => {
    setSelectedPerson(person);
  };

  const pageTitle = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {pageTitle}
        </h1>
        <Autocomplete onSelect={handleSelect} people={peopleFromServer} />
      </main>
    </div>
  );
};
