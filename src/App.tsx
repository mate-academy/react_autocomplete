import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson && selectedPerson.name === query
            ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          query={query}
          onQueryChange={setQuery}
          people={peopleFromServer}
          onSelected={handleSelectPerson}
        />
      </main>
    </div>
  );
};
