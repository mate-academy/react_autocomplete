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
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const applyQuery
  = useCallback(debounce((value: string) => {
    setIsDropdownVisible(true);

    return setAppliedQuery(value);
  }, 1000), [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDropdownVisible(false);
    setQuery(event.target.value);
    applyQuery(event.target.value.trim());
  };

  const filteredPeople: Person[] = useMemo(() => {
    return filterPeopleByQuery(peopleFromServer, appliedQuery);
  }, [appliedQuery]);

  const [selectedPerson, setSelectedPerson]
    = useState<Person | null>(null);

  const onSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsDropdownVisible(false);
  };

  const titleMessage = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <main className="section">
      <h1 className="title">
        {titleMessage}
      </h1>

      <div className="dropdown is-active">
        <SearchBar
          setIsDropdownVisible={setIsDropdownVisible}
          handleQueryChange={handleQueryChange}
          query={query}
        />

        {isDropdownVisible && (
          <DropdownList
            filteredPeople={filteredPeople}
            onSelect={onSelect}
          />
        )}

      </div>
    </main>
  );
};
