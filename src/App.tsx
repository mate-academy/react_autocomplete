import React, { useState } from 'react';
import './App.scss';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);
  const { name, born, died } = person || {};
  const findUser = person
    ? `${name} (${born} - ${died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {findUser}
        </h1>

        <Dropdown delay={300} onSelected={setPerson} />
      </main>
    </div>
  );
};
