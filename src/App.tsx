import React, { useCallback, useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');

  const title = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setSelectedPerson(null);
  }, []);

  const handleSelect = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <Dropdown
          query={query}
          people={peopleFromServer}
          delay={300}
          onSelect={handleSelect}
          onQueryChange={handleQueryChange}
        />
      </main>
    </div>
  );
};
