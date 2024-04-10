import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

const delay = 300;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson ? (
            <h1 key={selectedPerson.slug} className="title" data-cy="title">
              {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
            </h1>
          ) : (
            <h1 className="title" data-cy="title">
              No selected person
            </h1>
          )}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onPersonSelect={setSelectedPerson}
          delay={delay}
        />
      </main>
    </div>
  );
};
