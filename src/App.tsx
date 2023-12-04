import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropDown } from './Components/DropDown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [select, setSelect] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {select ? `${select?.name} (${select?.born} = ${select?.died})` : 'No selected person'}
      </h1>

      <DropDown
        people={peopleFromServer}
        onSelected={setSelect}
      />
    </main>
  );
};
