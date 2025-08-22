import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

import { Person } from './types/Person';

import Autocomplete from './components/Autocomplete';

const delay = 300;

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const onQueryChange = (char: string) => {
    setQuery(char);
  };

  const handleSelect = (person: Person | null) => {
    setSelectedPerson(person);
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
          query={query}
          people={peopleFromServer}
          onSelectedPerson={handleSelect}
          onQueryChange={onQueryChange}
          delay={delay}
        />
      </main>
    </div>
  );
};
