import React, { useState } from 'react';
import './App.scss';
import Dropdown from './Dropdown';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);
  const { name, born, died } = person || {};

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {person ? `${name} (${born} - ${died})` : 'No selected person'}
        </h1>

        <Dropdown
          delay={300}
          onSelected={setPerson}
          peopleList={peopleFromServer}
        />
      </main>
    </div>
  );
};
