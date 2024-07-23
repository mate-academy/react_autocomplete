import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';
import { DisplayedPerson } from './helper/helper';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          <DisplayedPerson selected={selectedPerson} />
        </h1>

        <Dropdown setSelected={setSelectedPerson} delay={300} />
      </main>
    </div>
  );
};
