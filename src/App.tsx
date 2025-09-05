import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownItem } from './components/DropdownItem/DropdownItem';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);

  const handleSelect = (person: Person) => {
    setCurrentPerson(person);
  };

  const handleInputChange = () => {
    setCurrentPerson(null);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {currentPerson
            ? `${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`
            : 'No selected person'}
        </h1>

        <DropdownItem
          people={peopleFromServer}
          onSelect={handleSelect}
          onInputChange={handleInputChange}
          debounceDelay={300}
        />
      </main>
    </div>
  );
};
