import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<{
    name: string;
    born: number;
    died: number;
  } | null>(null);

  const title = selectedPerson
  ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
  : "No selected person";

  return (
    <div className="container">
      <main className="section">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onSelected={setSelectedPerson}
        />
      </main>
    </div>
  );
};
