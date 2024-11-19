import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import Autocomplete from './Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isInputChanging, setIsInputChanging] = useState(false);

  const handleInputChange = () => {
    setIsInputChanging(true);
    setSelectedPerson(null);
  };

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setIsInputChanging(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson && !isInputChanging
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onSelect={handleSelect}
          onInputChange={handleInputChange}
        />
      </main>
    </div>
  );
};
