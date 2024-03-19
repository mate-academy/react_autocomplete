import React, { useState } from 'react';
import './App.scss';
import { Dropdown } from './component/Dropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] =
    useState<string>('No selected person');

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson}
        </h1>

        <Dropdown onSelected={setSelectedPerson} delay={300} />
      </main>
    </div>
  );
};
