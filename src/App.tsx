import React, { useState } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import './App.scss';
import { AutoComplete } from './components/AutoComplete/AutoComplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <AutoComplete
        options={peopleFromServer}
        onSelected={(person: Person) => setSelectedPerson(person)}
        delay={1000}
      />
    </main>
  );
};
