import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropDown } from './components/DropDown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // const delay = 1000;

  return (
    <main className="section">
      <h1 className="title">
        {
          selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'
        }
      </h1>

      <DropDown
        people={peopleFromServer}
        // delay={delay}
        onSelected={setSelectedPerson}
      />
    </main>
  );
};
