import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';
import { peopleFromServer } from './data/people';

interface AppProps {
  debounceDelay?: number;
}

export const App: React.FC<AppProps> = ({ debounceDelay = 1000 }) => {
  const [activePerson, setActivePerson] = useState<Person>();

  const handleSelectedPerson = (selectedPerson: Person) => {
    setActivePerson(selectedPerson);
  };

  return (
    <main className="section">
      <h1 className="title">
        {activePerson
          ? `${activePerson.name} (${activePerson.born} = ${activePerson.died})`
          : 'No selected person'}
      </h1>

      <Dropdown
        people={peopleFromServer}
        debounceDelay={debounceDelay}
        onSelected={handleSelectedPerson}
      />
    </main>
  );
};
