import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selected, setSelected] = useState<Person | null>(null);
  const peopleInfo = `${selected?.name} (${selected?.born} - ${selected?.died})`;

  return (
    <main className="section">
      <h1 className="title">
        {selected ? (
          peopleInfo
        ) : (
          'No selected person'
        ) }
      </h1>
      <Autocomplete onSelected={setSelected} people={peopleFromServer} />
    </main>
  );
};
