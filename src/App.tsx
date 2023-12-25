import React, { useState } from 'react';
import './App.scss';

import { DropDown } from './components/DropDown';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

const TIMER_FILTER_DELAY = 1000;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
        ) : 'No selected person'}
      </h1>

      <DropDown
        onSelected={setSelectedPerson}
        listOfPeople={peopleFromServer}
        delay={TIMER_FILTER_DELAY}
      />
    </main>
  );
};
