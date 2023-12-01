import React, { useState } from 'react';
import './App.scss';
import { DropDownMenu } from './components/DropDownMenu/DropDownMenu';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const onSelected = (person: Person) => {
    setSelectedPerson(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {
          selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
            : 'No selected person'
        }
      </h1>

      <DropDownMenu
        setSelectedPerson={onSelected}
      />
    </main>
  );
};
