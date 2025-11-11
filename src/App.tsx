import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import Autocomplete from './components/Autocomplete';
import type { Person } from './types/Person';

export const App: React.FC = () => {
  const [selected, setSelected] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          delay={300}
          onSelected={p => setSelected(p)}
          onInputChange={v => {
            // если пользователь редактирует поле вручную, очищаем selection
            if (selected && v !== selected.name) {
              setSelected(null);
            }
          }}
        />
      </main>
    </div>
  );
};
