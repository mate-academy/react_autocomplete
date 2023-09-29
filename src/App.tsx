import React, { useState } from 'react';

import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const delay = 1000;

  return (
    <main className="section">
      <h1 className="title">
        {!selectedPerson
          ? 'No selected person'
          : `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
      </h1>

      <Autocomplete
        delay={delay}
        onSelected={(person) => setSelectedPerson(person)}
      />
    </main>
  );
};
