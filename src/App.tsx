import React, { useState } from 'react';
import './App.scss';
import { SearchField } from './SearchField/SearchField';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);

  const handleSelect = (person: Person | null) => {
    setSelectPerson(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectPerson
          ? `${selectPerson.name} (${selectPerson.born} - ${selectPerson.died})`
          : 'No selected person'}
      </h1>
      <SearchField onSelected={handleSelect} delay={1000} />
    </main>
  );
};
