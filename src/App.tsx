import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './component/Autocomplete';

const DELAY = 300;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPeople] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson?.name
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          onSelected={setSelectedPeople}
          delay={DELAY}
          people={peopleFromServer}
          selectedPerson={selectedPerson}
        />
      </main>
    </div>
  );
};
