import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selected, setSelected] = useState<Person | null>(null);
  const [query, setQuery] = useState('');

  const people = useMemo(() => {
    if (!query) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(
      (person) => person.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  const onQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setSelected(null);
    },
    [],
  );

  const onSelected = useCallback((person: Person | null) => {
    if (person) {
      setSelected(person);
      setQuery('');
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
