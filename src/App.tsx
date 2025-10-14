import React, { useState } from 'react';
import './App.scss';

import { Person } from './types/Person';
import { peopleFromServer as people } from './data/people';
import { Autocomplete } from './Autocomplete/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null); 

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={people}
          selectedPerson={selectedPerson}
          onSelected={setSelectedPerson}
          delayMs={300}
          placeholder="Enter a part of the name"
        />
      </main>
    </div>
  );
};
