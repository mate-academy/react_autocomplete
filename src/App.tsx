import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { PeopleDropdown } from './components/PeopleDropdown';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filteredPeople = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return normalizedQuery
      ? peopleFromServer
        .filter(({ name }) => name.toLowerCase().includes(normalizedQuery))
      : peopleFromServer;
  }, [query]);

  const handleQueryChanged = useCallback((newQuery: string) => {
    if (newQuery !== query) {
      setQuery(newQuery);
    }
  }, [query]);

  const handlePersonSelected = useCallback((newSelectedPerson: Person) => {
    if (selectedPerson !== newSelectedPerson) {
      setSelectedPerson(newSelectedPerson);
      setQuery('');
    }
  }, [selectedPerson]);

  return (
    <main className="section">
      {selectedPerson && (
        <h1 className="title">
          {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>
      )}

      <PeopleDropdown
        key={selectedPerson?.slug}
        people={filteredPeople}
        onQueryChange={handleQueryChanged}
        onPersonSelected={handlePersonSelected}
        delay={1000}
      />
    </main>
  );
};
