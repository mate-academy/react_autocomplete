import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person | null) => {
    setSelectedPerson(person);
  };

  const title = useMemo(() => {
    return selectedPerson
      ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
      : 'No selected person';
  }, [selectedPerson]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onPersonSelect={handleSelectedPerson}
          delay={300}
        />
      </main>
    </div>
  );
};
