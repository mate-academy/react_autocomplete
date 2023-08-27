import React, { useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {person
          ? `${person.name} (${person.born} - ${person.died})`
          : 'Person is not selected'}
      </h1>

      <Dropdown
        people={peopleFromServer}
        changePerson={setPerson}
        debounceDelay={1000}
      />
    </main>
  );
};
