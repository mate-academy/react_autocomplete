import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropDown } from './components/DropDown/DropDown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectPerson
          ? `${selectPerson.name} (${selectPerson.born} - ${selectPerson.died})`
          : 'Person is not selected'}
      </h1>

      <DropDown
        persons={peopleFromServer}
        onSelectPerson={setSelectPerson}
        delay={1000}
      />
    </main>
  );
};
