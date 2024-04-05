import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { AutoComplete } from './Components/AutoComplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container center">
      <main className="section is-flex is-flex-direction-column">
        {!selectedPerson && (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        {selectedPerson && (
          <h1 className="title" data-cy="title">
            {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          </h1>
        )}

        <AutoComplete
          peopleFromServer={peopleFromServer}
          delay={1000}
          setSelectedPerson={setSelectedPerson}
        />
      </main>
    </div>
  );
};
