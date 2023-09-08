import React, { useCallback, useMemo, useState } from 'react';
import { debounce } from 'lodash';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownList } from './components/DropdownList';
import { SearchBar } from './components/SearchBar';

function filterPeopleByQuery(peopleToFilter: Person[], query: string) {
  const normalisedQuery = query.toLowerCase();

  return peopleToFilter
    .filter(({ name }) => name.toLocaleLowerCase().includes(normalisedQuery));
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredPeople: Person[] = useMemo(() => {
    return filterPeopleByQuery(peopleFromServer, appliedQuery);
  }, [appliedQuery]);

  const applyQuery
  = useCallback(debounce(setAppliedQuery, 1000), [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value.trim());
  };

  const [selectedPerson, setSelectedPerson]
    = useState<Person>(filteredPeople[0]);

  const { name, born, died } = selectedPerson;

  return (
    <main className="section">
      <h1 className="title">
        {`${name} (${born} - ${died})`}
      </h1>

      <div className="dropdown is-active">
        <SearchBar
          handleQueryChange={handleQueryChange}
          query={query}
        />

        <DropdownList
          filteredPeople={filteredPeople}
          setSelectedPerson={setSelectedPerson}
        />
      </div>
    </main>
  );
};
