import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import Autocomplete from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {!selectedPerson
            ? 'No selected person'
            : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>

        {/*
          Передаємо onSelected для збереження людини
          та onInputChange для скидання в null, коли користувач починає друкувати
        */}
        <Autocomplete
          onSelected={setSelectedPerson}
          onInputChange={() => setSelectedPerson(null)}
        />
      </main>
    </div>
  );
};
