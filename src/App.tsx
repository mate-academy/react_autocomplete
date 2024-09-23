import React, { useState } from 'react';

import './App.scss';
import { Dropdown } from './components/Dropdown/Dropdown';
import { Person } from './types/Person';

const delay = 300;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};

  const selectedPersonInfo = selectedPerson
    ? `${name} (${born} - ${died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPersonInfo}
        </h1>

        <Dropdown onSelect={setSelectedPerson} delay={delay} />
      </main>
    </div>
  );
};
