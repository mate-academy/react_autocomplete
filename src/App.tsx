import React, { useCallback, useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectedPerson = useCallback((person: Person | null) => {
    setSelectedPerson(person);
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete delay={1000} onSelected={handleSelectedPerson} />
      </main>
    </div>
  );
};
