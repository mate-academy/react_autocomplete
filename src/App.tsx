import React, { useState, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handlePersonSelected = useCallback((person: Person | null) => {
    setSelectedPerson(person);
  }, []);

  const titleText = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {titleText}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onSelected={handlePersonSelected}
          delay={300}
        />
      </main>
    </div>
  );
};
