import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const people = peopleFromServer;
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleResetPerson = () => {
    setSelectedPerson(null);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={people}
          onSelect={handleSelectPerson}
          onReset={handleResetPerson}
          selectedPerson={selectedPerson}
        />
      </main>
    </div>
  );
};
