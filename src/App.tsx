import React, { useState } from 'react';
import './App.scss';
import { Dropdown } from './components/Dropdown';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [onSelected, setOnSelected] = useState<Person | null>(null);

  const titleName = `${onSelected?.name} (${onSelected?.born} = ${onSelected?.died})`;

  return (
    <main className="section">
      <h1 className="title">
        {!onSelected ? 'No selected person' : titleName}
      </h1>
      <Dropdown
        setOnSelected={setOnSelected}
        people={peopleFromServer}
      />
    </main>
  );
};
