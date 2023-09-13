import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';

const DELAY = 1000;

export const App: React.FC = () => {
  const [selectedPersonSlug, setSelectedPersonSlug] = useState<string>('');
  const selectedPerson = peopleFromServer
    .find(person => person.slug === selectedPersonSlug);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>
      <Autocomplete
        people={peopleFromServer}
        onSelected={setSelectedPersonSlug}
        delay={DELAY}
      />
    </main>
  );
};
