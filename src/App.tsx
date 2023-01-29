import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './Drowpdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [people] = useState(peopleFromServer);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (
            `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          ) : (
            'No selected person'
          )}
      </h1>

      <Dropdown
        onSelect={setSelectedPerson}
        people={people}
      />
    </main>
  );
};
