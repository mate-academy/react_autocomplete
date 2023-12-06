import React, { useState } from 'react';
import './App.scss';
import { Dropdown } from './components/Dropdown';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const TIMER_FILTER_DELAY = 1000;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (
            <p>
              {`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
            </p>
          )
          : <p>No selected person.</p>}
      </h1>

      <Dropdown
        onSelect={setSelectedPerson}
        people={peopleFromServer}
        delay={TIMER_FILTER_DELAY}
      />
    </main>
  );
};
