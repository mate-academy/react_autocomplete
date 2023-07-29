import React, { useMemo, useState } from 'react';
import './App.scss';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocompolete/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.toLocaleLowerCase()
        .includes(appliedQuery.toLocaleLowerCase()));
  }, [appliedQuery, peopleFromServer]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson?.born} = ${selectedPerson?.died})`
          : 'No selected user'}
      </h1>

      <Autocomplete
        people={filteredPeople}
        setAppliedQuery={setAppliedQuery}
        delay={1000}
        setPerson={setSelectedPerson}
        selectedPerson={selectedPerson}
      />
    </main>
  );
};
