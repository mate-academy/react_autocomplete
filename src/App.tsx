import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>();
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(el => el.name.toLowerCase()
        .includes(appliedQuery.trim().toLowerCase()));
  }, [appliedQuery]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  const resetField = () => {
    setQuery('');
    applyQuery('');
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        people={filteredPeople}
        query={query}
        setSelectedPerson={setSelectedPerson}
        queryChange={handleQueryChange}
        resetField={resetField}
      />
    </main>
  );
};
