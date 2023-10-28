import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

const getFilteredPeople = (query:string) => {
  if (!query) {
    return peopleFromServer;
  }

  const newPeople = peopleFromServer.filter((person) =>
    person.name.toLowerCase().includes(query.toLowerCase()));

  return newPeople;
};

export const App: React.FC = () => {
  const [selected, setSelected] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const people = getFilteredPeople(appliedQuery);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 500),
    [appliedQuery],
  );

  const onQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setSelected(null);
      applyQuery(event.target.value);
    },
    [],
  );

  const onSelected = useCallback((person: Person | null) => {
    if (person) {
      setSelected(person);
      setQuery('');
      applyQuery('');
    }
  }, []);

  return (
    <main className="section">
      {selected ? (
        <h1 className="title">{`${selected?.name} (${selected?.born} = ${selected?.died})`}</h1>
      ) : (
        <h1 className="title">Select a person</h1>
      )}
      <Dropdown
        people={people}
        delay={150}
        onSelected={onSelected}
        selected={selected}
        query={query}
        onQueryChange={onQueryChange}
      />
    </main>
  );
};
