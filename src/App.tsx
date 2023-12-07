import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};
  const onSelectedPerson = (person: Person | string) => {
    if (typeof person === 'string') {
      setSelectedPerson(null);
    } else {
      setSelectedPerson(person);
    }
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${name} (${born} = ${died})`
          : 'No selected person'}
      </h1>
      <Autocomplete
        people={peopleFromServer}
        onSelected={onSelectedPerson}
      />
    </main>
  );
};
