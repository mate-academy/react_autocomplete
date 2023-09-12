import React, { useState } from 'react';
import './App.scss';

import { Person } from './types/Person';
import { Autocomplete } from './Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (
            <div>
              {`${selectedPerson.name}`
                + ` (${selectedPerson.born} - ${selectedPerson.died})`}
            </div>
          )
          : 'No selected person'}
      </h1>

      <Autocomplete
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
      />
    </main>
  );
};
