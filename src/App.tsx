import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown/Dropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};

  const showMessage = selectedPerson
    ? `${name} (${born} - ${died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {showMessage}
        </h1>

        <Dropdown onSelected={setSelectedPerson} delay={300} />
      </main>
    </div>
  );
};
