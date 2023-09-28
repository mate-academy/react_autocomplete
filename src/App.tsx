import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/PeopleList';

export const App: React.FC = () => {
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectPerson
          ? `${selectPerson.name} (${selectPerson.born} = ${selectPerson.died})`
          : 'No selected person'}
      </h1>

      <PeopleList
        people={peopleFromServer}
        onSelect={setSelectPerson}
      />
    </main>
  );
};
