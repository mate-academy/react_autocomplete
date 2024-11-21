import './App.scss';

import React, { useState } from 'react';

import Dropdown from './components/Dropdown';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPeople, setSelectedPeople] = useState<Person | null>(null);

  const onSelected = (person: Person) => {
    setSelectedPeople(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPeople ? (
          <h1 className="title" data-cy="title">
            {`${selectedPeople.name} (${selectedPeople.born} - ${selectedPeople.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <Dropdown
          people={peopleFromServer}
          delay={300}
          onSelected={onSelected}
        />
      </main>
    </div>
  );
};
