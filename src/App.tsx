import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [people] = useState<Person[]>(peopleFromServer);
  const [selectedPerson, setSelectedPerson]
    = useState<Person | null>(null);

  const onSelected = (person: Person) => {
    const selected = people.find(value => value === person) || null;

    setSelectedPerson(selected);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>
      <Dropdown
        people={people}
        onSelected={onSelected}
      />
    </main>
  );
};
