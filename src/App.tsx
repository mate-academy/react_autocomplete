import React, { useState } from 'react';
import './App.scss';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {person
            ? `${person.name} (${person.born} - ${person.died})`
            : 'No selected person'}
        </h1>

        <Dropdown onSelected={setPerson} delay={300} />
      </main>
    </div>
  );
};
