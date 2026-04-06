import React, { useState, useCallback } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const getSelectedPersonTitle = (): string => {
    if (selectedPerson) {
      return (
        `${selectedPerson.name}` +
        ` (${selectedPerson.born} - ${selectedPerson.died})`
      );
    }

    return 'No selected person';
  };

  const onSelected = useCallback((person: Person | null) => {
    setSelectedPerson(person);
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {getSelectedPersonTitle()}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          delay={1_000}
          onSelected={onSelected}
        />
      </main>
    </div>
  );
};
