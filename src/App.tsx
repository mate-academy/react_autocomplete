import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import Autocomplete from './Autocomplete';

export const App: React.FC = () => {
  const [selected, setSelected] = useState<Person | null>(null);

  const handleSelected = (person: Person | string) => {
    if (typeof person === 'string') {
      //
    } else {
      setSelected(person);
    }
  };

  return (
    <main className="section">
      <h1 className="title">
        {selected
          ? `${selected.name} (${selected.born} - ${selected.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        people={peopleFromServer}
        debounceDelay={500}
        onSelected={handleSelected}
      />
    </main>
  );
};
