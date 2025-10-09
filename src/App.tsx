import React, { useState } from 'react';
import './App.scss';

import { Person } from './types/Person';
import { peopleFromServer as people } from './data/people';
import { Autocomplete } from './Autocomplete/Autocomplete';

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
          people={people}
          selectedPerson={selected}
          onSelected={setSelected}
          delayMs={300}
          placeholder="Enter a part of the name"
        />
      </main>
    </div>
  );
};
