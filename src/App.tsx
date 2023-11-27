import React, { useState } from 'react';
import './App.scss';

import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

const people = peopleFromServer.map((person, index) => {
  return {
    ...person,
    id: index + 1,
  };
});

export const App: React.FC = () => {
  const [selectedPerson, setSelectesPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No matching suggestions'}
      </h1>

      <Autocomplete
        people={people}
        setSelectedPerson={setSelectesPerson}
      />

    </main>
  );
};
