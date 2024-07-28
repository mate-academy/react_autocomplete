import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const title = useMemo(
    () =>
      selectedPerson
        ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
        : 'No selected person',
    [selectedPerson],
  );

  const handleSelect = useCallback((name: string | null) => {
    if (!name) {
      setSelectedPerson(null);

      return;
    }

    const person = peopleFromServer.find(p => p.name === name) || null;

    setSelectedPerson(person);
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <Dropdown
          selectedPerson={selectedPerson?.name}
          onSelected={handleSelect}
        />
      </main>
    </div>
  );
};
