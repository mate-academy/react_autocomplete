import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './Components/Dropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      {selectedPerson
        ? (
          <h1 className="title">
            {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          </h1>
        )
        : (
          <h1 className="title">
            No selected person
          </h1>
        )}

      <Dropdown
        people={peopleFromServer}
        onSelected={setSelectedPerson}
        selectedPerson={selectedPerson}
      />
    </main>
  );
};
