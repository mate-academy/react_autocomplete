import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './Components/Dropdown/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const { name, born, died } = selectedPerson || ({} as Person);

  const handleSelectPerson = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${name} (${born} - ${died})`
            : 'No selected person'}
        </h1>

        <Dropdown people={peopleFromServer} onSelect={handleSelectPerson} />
      </main>
    </div>
  );
};
