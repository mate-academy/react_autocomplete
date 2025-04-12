import React, { useState, useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { SearchBar } from './components/SearchBar/SearchBar';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    document.title = selectedPerson
      ? `Selected Person: ${selectedPerson.name} (${selectedPerson.born || ''} - ${selectedPerson.died || ''})`
      : 'No selected person';
  }, [selectedPerson]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born || ''} - ${selectedPerson.died || ''})`
            : 'No selected person'}
        </h1>
        <SearchBar
          people={peopleFromServer}
          onPersonSelected={setSelectedPerson}
        />
      </main>
    </div>
  );
};
