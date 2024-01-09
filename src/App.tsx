import React, { useState, useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person | null) => {
    setSelectedPerson(person);
  };

  const headerText = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
    : 'No selected person';

  useEffect(() => {
    if (!selectedPerson) {
      handleSelectedPerson(null);
    }
  }, [selectedPerson]);

  return (
    <main className="section">
      <h1 className="title">
        {headerText}
      </h1>

      <Autocomplete
        people={peopleFromServer}
        delay={1000}
        onSelected={handleSelectedPerson}
        clearSelected={false}
      />
    </main>
  );
};
