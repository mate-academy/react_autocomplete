import React, { useState } from 'react';
import 'bulma/css/bulma.css';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [onSelected, setOnSelected] = useState<Person | null>(null);

  const handleSelect = (person: Person | null) => {
    setOnSelected(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {onSelected
          ? (`${onSelected.name} (${onSelected.born} = ${onSelected.died})`)
          : ('No matching suggestions')}
      </h1>

      <Dropdown
        persons={peopleFromServer}
        handleSelect={handleSelect}
      />
    </main>
  );
};
