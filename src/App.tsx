import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropDown } from './components/DropDown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      {selectedPerson ? (
        <h1 className="title">
          {`${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`}
        </h1>
      ) : (
        <h1 className="title">No selected person</h1>
      )}

      <DropDown
        listOfPeople={peopleFromServer}
        onSelected={setSelectedPerson}
      />
    </main>
  );
};
