import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { ListPeople } from './components/ListPeople/ListPeople';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPeson, setSelectedPeson] = useState<Person | null>(null);

  const serverQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    serverQuery(event.target.value);
  };

  const handleSelectedPerson = (person: Person) => {
    setSelectedPeson(person);
    setQuery(person.name);
    serverQuery(person.name);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.includes(appliedQuery));
  }, [peopleFromServer, appliedQuery]);

  return (
    <main className="section">
      {selectedPeson ? (
        <h1 className="title">
          {`${selectedPeson.name} (${selectedPeson.born} = ${selectedPeson.died})`}
        </h1>
      )
        : (
          <h1 className="title">
            No selected person
          </h1>
        )}

      <ListPeople
        people={filteredPeople}
        query={query}
        onQuery={handleQueryChange}
        onSelected={handleSelectedPerson}
      />
    </main>
  );
};
