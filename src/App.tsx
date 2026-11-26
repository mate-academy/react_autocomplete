import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import Autocomplete from './components/Autocomplete';
import { Person } from './types/Person';

const debounceDelay = 300;

export const App: React.FC = () => {
  const [currentHuman, setCurrentHuman] = useState<Person | null>(null);
  const [query, setQuery] = useState('');

  const handleHumanPick = (person: Person) => {
    setCurrentHuman(person);
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    if (currentHuman) {
      setCurrentHuman(null);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {currentHuman
            ? `${currentHuman.name} (${currentHuman.born} - ${currentHuman.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          peoples={peopleFromServer}
          onSelected={handleHumanPick}
          query={query}
          onQueryChange={handleQueryChange}
          debounceDelay={debounceDelay}
        />
      </main>
    </div>
  );
};
