import React, { useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selected, setSelected] = useState<Person | null>(null);
  const isSelected = selected !== null;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {isSelected ? (
          <h1 className="title" data-cy="title">
            {`${selected.name} (${selected.born} - ${selected.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <Autocomplete
          onSelected={setSelected}
          onInputChange={() => setSelected(null)}
        />
      </main>
    </div>
  );
};
