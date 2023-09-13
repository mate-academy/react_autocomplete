import React, { useState, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

import { peopleFromServer } from '../../data/people';

import { SearchBar } from '../SearchBar';
import { DropdownList } from '../DropdownList';
import { Person } from '../../types/Person';

function filterPeopleByQuery(peopleToFilter: Person[], query: string) {
  const normalisedQuery = query.toLowerCase();

  return peopleToFilter
    .filter(({ name }) => name.toLocaleLowerCase().includes(normalisedQuery));
}

type Props = {
  setSelectedPerson: (person: Person) => void,
  delay: number,
};

export const Autocomplete: React.FC<Props> = ({ setSelectedPerson, delay }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const applyQuery
  = useCallback(debounce((value: string) => {
    setIsDropdownVisible(true);

    return setAppliedQuery(value);
  }, delay), [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDropdownVisible(false);
    setQuery(event.target.value);
    applyQuery(event.target.value.trim());
  };

  const filteredPeople: Person[] = useMemo(() => {
    return filterPeopleByQuery(peopleFromServer, appliedQuery);
  }, [appliedQuery]);

  const onSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsDropdownVisible(false);
  };

  return (
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
  );
};
