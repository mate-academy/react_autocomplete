import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {currentPerson ? (
          <h1 className="title" data-cy="title">
            {`${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <Autocomplete
          people={peopleFromServer}
          onSelected={setCurrentPerson}
          delay={300}
        />
      </main>
    </div>
  );
};
