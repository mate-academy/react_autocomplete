import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './commponents/Dropdown/Dropdown';

export const App: React.FC = () => {
  const [selectedPersone, setSelectedPersone] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPersone ? (
          <h1 className="title" data-cy="title">
            {`${selectedPersone.name} (${selectedPersone.born} - ${selectedPersone.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            {`No selected person`}
          </h1>
        )}

        <Dropdown
          onSelected={people => setSelectedPersone(people)}
          peopleData={peopleFromServer}
        />
      </main>
    </div>
  );
};
