import { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';

import { Person } from './types/Person';
import React = require('react');

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const chosenPerson = selectedPerson
    ? `${name} (${born} - ${died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {chosenPerson}
        </h1>
        <Dropdown
          people={peopleFromServer}
          onSelected={setSelectedPerson}
          person={selectedPerson}
        />
      </main>
    </div>
  );
};
