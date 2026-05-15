import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete/Autocomplete.tsx';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelect = useCallback((person: Person) => {
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
        <Autocomplete
          people={peopleFromServer}
          onSelect={handleSelect}
          onChange={() => {
            setSelectedPerson(null);
          }}
          delay={300}
        />
      </main>
    </div>
  );
};
