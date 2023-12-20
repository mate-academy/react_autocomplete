import React, { useState } from 'react';
import './App.scss';

import { Person } from './types/Person';
import { DropdownList } from './components/DropdownList';

export const App: React.FC = () => {
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);
  const { name, born, died } = selectPerson || {};

  const getSelectPerson = (person: Person | null) => {
    setSelectPerson(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectPerson && name
          ? `${name} (${born} - ${died})`
          : 'No selected person'}
      </h1>

      <DropdownList
        onSelected={getSelectPerson}
        delay={1000}
      />
    </main>
  );
};
