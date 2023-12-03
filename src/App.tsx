import React, { useCallback, useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

export const App: React.FC = () => {
  const [selectetPerson, setSelectedPerson] = useState<Person | null>(null);

  const handlePersonClick = useCallback((person: Person) => {
    setSelectedPerson(person);
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectetPerson ? (
          `${selectetPerson.name} (${selectetPerson.born} = ${selectetPerson.died})`
        ) : (
          'No selected person'
        )}
      </h1>
      <Dropdown delay={1000} onClick={handlePersonClick} />
    </main>
  );
};
