import React, { useMemo, useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';

const delay = 1000;

export const App: React.FC = () => {
  const [person, setPerson] = useState<null | Person>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(currentPerson => {
      const normalizedQuery = appliedQuery.toLowerCase();

      return currentPerson.name.toLowerCase().includes(normalizedQuery);
    });
  }, [peopleFromServer, appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {person ? `${person.name} (${person.born} = ${person.died})` : 'No selected person'}
      </h1>

      <Dropdown
        people={filteredPeople}
        query={query}
        setQuery={setQuery}
        setAppliedQuery={setAppliedQuery}
        setPerson={setPerson}
        delay={delay}
      />
    </main>
  );
};
