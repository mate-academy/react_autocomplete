import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const personsNames = useMemo(
    () => peopleFromServer.map(person => person.name),
    [],
  );

  const title = useMemo(
    () =>
      selectedPerson
        ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
        : 'No selected person',
    [selectedPerson],
  );

  const handlePersonSelect = (name: string | null) => {
    if (!name) {
      setSelectedPerson(null);

      return;
    }

    const person = peopleFromServer.find(p => p.name === name) || null;

    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <Dropdown
          options={personsNames}
          selectedPerson={selectedPerson?.name}
          onSelected={handlePersonSelect}
        />
      </main>
    </div>
  );
};
