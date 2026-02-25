import React, { useState } from 'react';
import { peopleFromServer } from './data/people';
import { PeopleAutocomplete } from './components/PeopleAutocomplete';
import { Person } from './types/Person';
import './App.scss';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelect = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <PeopleAutocomplete
          people={peopleFromServer}
          onSelected={handleSelect}
        />
      </main>
    </div>
  );
};
