import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleInputChange = (inputValue: string) => {
    if (selectedPerson && inputValue !== selectedPerson.name) {
      setSelectedPerson(null);
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

        <Autocomplete
          onSelect={setSelectedPerson}
          people={peopleFromServer}
          onInputChange={handleInputChange}
        />
      </main>
    </div>
  );
};
