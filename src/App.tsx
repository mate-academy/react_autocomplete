import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown/Dropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');

  const onSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson && query ? (
          `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <Dropdown
        query={query}
        people={peopleFromServer}
        onSelected={onSelectPerson}
        onChange={(value) => setQuery(value)}
        delay={1000}
      />
    </main>
  );
};
