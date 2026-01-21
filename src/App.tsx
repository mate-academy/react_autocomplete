import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Suggestions } from './components/Suggestions';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [people] = useState<Person[]>(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedPerson(null); // ✅ очищаємо
  };

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson && (
          <h1 className="title" data-cy="title">
            {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          </h1>
        )}
        {!selectedPerson && (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <Suggestions
          people={people}
          query={query}
          onQueryChange={handleQueryChange}
          onSelect={handleSelect}
          delay={300}
        />
      </main>
    </div>
  );
};
