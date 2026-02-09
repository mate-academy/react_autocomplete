import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';
import { Dropdown } from './Components/Autocomplete';

export const App: React.FC = () => {
  const [selected, setSelected] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title"
        data-qa="title"
        data-cy="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

        <Dropdown people={peopleFromServer} onSelected={setSelected} />
      </main>
    </div>
  );
};
