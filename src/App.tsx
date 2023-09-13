import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components';

const DELAY_PROP = 1000;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [listIsVisible, setListIsVisible] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, DELAY_PROP),
    [],
  );

  const handlSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setListIsVisible(false);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const preparedPeople = useMemo(() => {
    return peopleFromServer.filter(person => {
      return person.name
        .toLowerCase().includes(appliedQuery.toLowerCase().trim());
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
        preparedPeople={preparedPeople}
        query={query}
        listIsVisible={listIsVisible}
        onQueryChange={handleQueryChange}
        onSelectedPerson={handlSelectedPerson}
        setListIsVisible={setListIsVisible}
      />
    </main>
  );
};
