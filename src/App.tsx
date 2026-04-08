import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filteredPeople = useMemo(() => {
    const searchTerm = query.trim().toLowerCase() || '';

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(searchTerm),
    );
  }, [query]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>
        <Dropdown
          people={filteredPeople}
          onPersonSelect={setSelectedPerson}
          delay={300}
          setQuery={setQuery}
        />
      </main>
    </div>
  );
};
