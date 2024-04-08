import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleContext } from './components/PeopleContext';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const people = peopleFromServer;

  const onSelect = (slug: string | null) => {
    setSelectedPerson((slug && people.find(p => p.slug === slug)) || null);
  };

  const contextValue = { people, selectedPerson, onSelect };

  return (
    <PeopleContext.Provider value={contextValue}>
      <div className="container">
        <main className="section is-flex is-flex-direction-column">
          <h1 className="title" data-cy="title">
            {selectedPerson
              ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
              : 'No selected person'}
          </h1>
          <Autocomplete />
        </main>
      </div>
    </PeopleContext.Provider>
  );
};
