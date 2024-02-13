import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './Components/Autocomplete/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};

  const onSelected = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson ? `${name} (${born} - ${died})` : 'No selected person'}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onSelected={onSelected}
          delay={500}
        />
      </main>
    </div>
  );
};
