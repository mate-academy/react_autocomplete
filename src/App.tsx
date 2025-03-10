import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer, Person } from './data/people';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name ?? ''} (${selectedPerson.born ?? ''} - ${selectedPerson.died ?? ''})`
            : 'No selected person'}
          {/* The ?? operator is the nullish coalescing operator. It returns the right-hand side operand if the left-hand side operand is null or undefined, and otherwise returns the left-hand side operand. */}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onSelected={setSelectedPerson}
        />
      </main>
    </div>
  );
};
