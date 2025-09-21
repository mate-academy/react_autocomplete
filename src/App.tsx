import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';

interface Person {
  name: string;
  born: number;
  died?: number;
  sex?: string;
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handlePersonSelected = (person: Person | null) => {
    setSelectedPerson(person);
  };

  const titleText = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died || '...'})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {titleText}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          delay={300}
          onSelected={handlePersonSelected}
          placeholder="Enter a part of the name"
        />
      </main>
    </div>
  );
};
