import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { debounce } from 'lodash';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';
import { PersonInfo } from './components/PersonInfo';
import { Placeholder } from './components/Placeholder';

const DELAY = 500;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyDebouncedQuery = useCallback(
    debounce(setDebouncedQuery, DELAY),
    [],
  );

  const filteredPeople = useMemo(() => (
    peopleFromServer.filter(
      ({ name }) => name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    )
  ), [debouncedQuery]);

  const visiblePeople: Person[] = useMemo(() => (
    filteredPeople
  ), [filteredPeople]);

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setSelectedPerson(null);
      setQuery(newQuery);
      applyDebouncedQuery(newQuery.trim());
    },
    [applyDebouncedQuery],
  );

  const handlePersonClick = useCallback(
    (person: Person) => {
      setSelectedPerson(person);
      setQuery(person.name);
      setDebouncedQuery('');
    },
    [],
  );

  const handleResetQuery = useCallback(
    () => {
      setSelectedPerson(null);
      setQuery('');
      setDebouncedQuery('');
    },
    [],
  );

  return (
    <main className="section">
      {
        selectedPerson
          ? <PersonInfo person={selectedPerson} />
          : <Placeholder />
      }

      <Dropdown
        people={visiblePeople}
        query={query}
        debouncedQuery={debouncedQuery}
        onQueryChange={handleQueryChange}
        onPersonClick={handlePersonClick}
        onResetQuery={handleResetQuery}
      />

    </main>
  );
};
