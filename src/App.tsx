import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownMenu } from './components/DropdownMenu/DropdownMenu';

export const App: React.FC = () => {
  const [people] = useState(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const personInfo = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {personInfo}
        </h1>

        <DropdownMenu
          people={people}
          onSelectedPerson={setSelectedPerson}
          delay={300}
        />
      </main>
    </div>
  );
};
