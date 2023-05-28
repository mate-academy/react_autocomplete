import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './Components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState('');
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuerry] = useState('');

  const applyQuery = useCallback(
    debounce(setAppliedQuerry, 500),
    [],
  );

  const onChangeInput = (value: React.SetStateAction<string>) => {
    setQuery(value);
  };

  const visiblePeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase()
        .includes(appliedQuery.toLocaleLowerCase()),
    );
  }, [peopleFromServer, appliedQuery]);

  const handleClick = (person: string) => {
    setSelectedPerson(person);
    setQuery('');
    setAppliedQuerry('');
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson || 'No person selected'}
      </h1>

      <Autocomplete
        list={visiblePeople}
        onChange={onChangeInput}
        value={query}
        onDelayApply={applyQuery}
        onSelect={handleClick}
        query={query}
      />
    </main>
  );
};
