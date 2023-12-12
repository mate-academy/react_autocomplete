import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './component/Drobdown';

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
        onSelected={setPerson}
        delay={1000}
      />
    </main>
  );
};
