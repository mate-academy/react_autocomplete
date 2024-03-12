import React, { useState } from 'react';
import './App.scss';
import { Dropdown } from './components/Dropdown';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const selectedPersonMessage = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  const handleSelected = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPersonMessage}
        </h1>

        <Dropdown people={peopleFromServer} onSelected={handleSelected} />
      </main>
    </div>
  );
};
