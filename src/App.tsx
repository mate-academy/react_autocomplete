import React, { useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown/Dropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <Dropdown
        people={peopleFromServer}
        onSelected={(person) => setSelectedPerson(person)}
        searchDelay={1000}
      />
    </main>
  );
};
