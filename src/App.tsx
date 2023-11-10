import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedHuman, setSelectedHuman] = useState<Person | null>(null);

  const filteredList = useMemo(() => {
    return peopleFromServer.filter(human => {
      return human.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedHuman
          ? `${selectedHuman.name} (${selectedHuman.born} = ${selectedHuman.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        filteredList={filteredList}
        query={query}
        setQuery={setQuery}
        setAppliedQuery={setAppliedQuery}
        onSelected={setSelectedHuman}
      />
    </main>
  );
};
