import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

const getFilteredPeople = (query: string) => {
  if (!query) {
    return peopleFromServer;
  }

  const newPeople = peopleFromServer.filter((person) => person.name
    .toLowerCase()
    .includes(query.toLowerCase()));

  return newPeople;
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const people = getFilteredPeople(appliedQuery);

  const applyQuery = useCallback(debounce(setAppliedQuery, 100), [
    appliedQuery,
  ]);

  const onQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setSelectedPerson(null);
      applyQuery(event.target.value);
    },
    [applyQuery],
  );

  const onSelected = useCallback(
    (person: Person | null) => {
      if (person) {
        setSelectedPerson(person);
        setQuery('');
        applyQuery('');
      }
    },
    [applyQuery],
  );

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} = ${selectedPerson?.died})`
          : 'Select a person'}
      </h1>
      <Dropdown
        people={people}
        delay={150}
        onSelected={onSelected}
        selected={selectedPerson}
        query={query}
        onQueryChange={onQueryChange}
      />
    </main>
  );
};
