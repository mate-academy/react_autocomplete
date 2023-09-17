import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete/Autocomplete';

const DEBOUNCE_DELAY = 1000;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  function formatPerson(person: Person | null) {
    if (person) {
      return `${person.name} (${person.born} - ${person.died})`;
    }

    return 'No selected person';
  }

  return (
    <main className="section">
      <h1 className="title">
        {formatPerson(selectedPerson)}
      </h1>

      <Autocomplete
        delay={DEBOUNCE_DELAY}
        onSelected={setSelectedPerson}
      />
    </main>
  );
};
