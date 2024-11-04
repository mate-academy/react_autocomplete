import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import Autocomplete from './components/Autocomplete/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  let title = 'No selected person';

  if (selectedPerson) {
    const { name, born, died } = selectedPerson;
    title = `${name} (${born} - ${died})`;
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          setSelectedPerson={setSelectedPerson}
          selectedPerson={selectedPerson}
        />
      </main>
    </div>
  );
};
