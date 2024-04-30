import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);
  const personInfo = person
    ? `${person.name} (${person.born} - ${person.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {personInfo}
        </h1>

        <Dropdown people={peopleFromServer} onSelected={setPerson} />
      </main>
    </div>
  );
};
