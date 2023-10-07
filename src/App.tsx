import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownInput } from './components/DropDownInput';
import { Person } from './types/Person';

const FILTERDELAY = 1000;

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      {person ? (
        <h1 className="title">
          {`${person.name} (${person.born} - ${person.died})`}
        </h1>
      ) : (
        <h1 className="title">
          No selected person
        </h1>
      )}

      <DropdownInput
        people={peopleFromServer}
        debounceDelay={FILTERDELAY}
        onSelect={setPerson}
      />
    </main>
  );
};
