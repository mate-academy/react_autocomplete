import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import { debounce } from 'lodash';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

import './App.scss';

export const App: React.FC = () => {
  const [appliedQuery, setAppliedQuery] = useState('');
  const [query, setQuery] = useState('');
  const [people] = useState('');
  const [selected, setSelected] = useState<Person | null>(null);

  const applyQuery = useCallback(
    debounce(
      setAppliedQuery,
      1000,
    ),
    [],
  );

  const selectPerson = useCallback((person) => {
    setSelected(person);
  }, [selected]);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(appliedQuery.toLowerCase())
    ));
  }, [people, appliedQuery]);

  const handleReset = () => {
    setAppliedQuery('');
    setQuery('');
    setSelected(null);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selected && query
          ? `${selected.name} (${selected.born} = ${selected.died})`
          : 'No selected person'}
      </h1>

      <Dropdown
        query={query}
        setQuery={setQuery}
        applyQuery={applyQuery}
        appliedQuery={appliedQuery}
        filteredPeople={filteredPeople}
        onSelected={selectPerson}
        handleReset={handleReset}
      />
    </main>
  );
};
