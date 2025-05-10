import React, { useState } from 'react';
import './App.scss';
import { AutoComplete } from './components/AutoComplete';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelected = (selectedName: string) => {
    const person = peopleFromServer.find(p => p.name === selectedName);

    if (person) {
      setSelectedPerson(person);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>
        <AutoComplete
          onSelected={handleSelected}
          onInputChange={() => setSelectedPerson(null)}
        />
      </main>
    </div>
  );
};
