import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      {selectedPerson ? (
        <h1 className="title">
          {`${name} (${born} - ${died})`}
        </h1>
      ) : (
        <h1 className="title"> No selected person </h1>
      )}

      <Autocomplete
        onSelected={(person) => setSelectedPerson(person)}
        persons={peopleFromServer}
        debounceDelay={1000}
      />
    </main>
  );
};
