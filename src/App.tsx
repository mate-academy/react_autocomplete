import React, { useState } from 'react';
import './App.scss';
import { DropDownMenu } from './components/DropDownMenu/DropDownMenu';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selected, setSelected] = useState<Person | null>(null);

  const onSelected = (person: Person) => {
    setSelected(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {
          selected
            ? `${selected.name} (${selected.born} = ${selected.died})`
            : 'No selected person'
        }
      </h1>

      <DropDownMenu
        setSelected={onSelected}
      />
    </main>
  );
};
