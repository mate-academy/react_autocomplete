import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './Components';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<null | Person>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const visiblePersons = useMemo(() => {
    return peopleFromServer.filter(person => person.name
      .toLocaleLowerCase()
      .includes(appliedQuery.toLocaleLowerCase()));
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson && `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
      </h1>

      <Dropdown
        delay={1000}
        personsDisplayed={visiblePersons}
        onSelected={setSelectedPerson}
        setQuery={setAppliedQuery}
      />
    </main>
  );
};
