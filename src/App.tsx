import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleInputChange = () => {
    if (selectedPerson !== null) {
      setSelectedPerson(null);
    }
  };

  const handleSelected = useCallback((person: Person) => {
    setSelectedPerson(person);
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson === null
            ? 'No selected person'
            : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          {}
        </h1>
        <Autocomplete
          items={peopleFromServer}
          onInputChange={handleInputChange}
          onSelected={handleSelected}
        />
      </main>
    </div>
  );
};
