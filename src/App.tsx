import React, { useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface PeopleContextI {
  people: Person[];
  selectedPerson: Person | null;
  onSelect: (slug: string | null) => void;
}

export const PeopleContext = React.createContext<PeopleContextI>({
  people: [],
  selectedPerson: null,
  onSelect: () => {},
});

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const people = peopleFromServer;

  const onSelect = (slug: string | null) => {
    setSelectedPerson(
      (slug && people.find(person => person.slug === slug)) || null,
    );
  };

  const contextValue = { people, selectedPerson, onSelect };

  const titleText = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <PeopleContext.Provider value={contextValue}>
      <div className="container">
        <main className="section is-flex is-flex-direction-column">
          <h1 className="title" data-cy="title">
            {titleText}
          </h1>
          <Autocomplete />
        </main>
      </div>
    </PeopleContext.Provider>
  );
};
