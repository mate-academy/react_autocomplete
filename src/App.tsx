import React, { useState } from 'react';

import { AutoSuggest } from './AutoSuggest';
import { Person } from './types/Person';
import './App.scss';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelected = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <AutoSuggest
        delay={1000}
        onSelected={handleSelected}
      />
    </main>
  );
};
