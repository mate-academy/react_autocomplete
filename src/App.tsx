import React from 'react';
import './App.scss';
import { useState } from 'react';
import { Person } from './types/Person';
import { AutoComplete } from './Components';

export const App: React.FC = () => {
  const [selected, onSelected] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

          <AutoComplete
            onSelected={onSelected}
          />
      </main>
    </div>
  );
};
