import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filteredList = useMemo(() => {
    return peopleFromServer.filter(person => {
      return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        query={query}
        setQuery={setQuery}
        setAppliedQuery={setAppliedQuery}
        filteredList={filteredList}
        setSelectedPerson={setSelectedPerson}
      />
    </main>
  );
};
