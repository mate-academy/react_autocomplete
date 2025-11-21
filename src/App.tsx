import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const peopleWithId = peopleFromServer.map((person, index) => ({
    ...person,
    id: index + 1,
  }));

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson !== null
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>
        <Autocomplete
          people={peopleWithId}
          delay={300}
          onSelected={person => setSelectedPerson(person)}
          selectedPerson={selectedPerson}
          onClearSelected={() => setSelectedPerson(null)}
        />
      </main>
    </div>
  );
};
