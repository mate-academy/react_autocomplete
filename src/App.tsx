import React, { useState, useMemo } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete/Autocomplete';
import { Person } from './types/Person';
import { findPersonrBySlug } from './helpers';

export const App: React.FC = () => {
  const [selectedPersonSlug, setSelectedPersonSlug] = useState('');

  const selectedPerson: Person | null = useMemo(
    () => findPersonrBySlug(peopleFromServer, selectedPersonSlug),
    [selectedPersonSlug],
  );

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        peopleFromServer={peopleFromServer}
        onSelected={setSelectedPersonSlug}
      />
    </main>
  );
};
