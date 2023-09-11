import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownMenu } from './components/DropdownMenu/DropdownMenu';
import { SearchInput } from './components/SearchInput/SearchInput';

function filterPeopleByQuery(people: Person[], query: string) {
  const normalizedQuery = query.toLowerCase();

  return people.filter((person) => {
    const normalizedName = person.name.toLowerCase();

    return normalizedName.includes(normalizedQuery);
  });
}

function queryDebounce(callBack: (a: string) => void, delay: number) {
  let timerId = 0;

  return (query: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callBack(query);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [queryValue, setQueryValue] = useState('');
  const [queryApplied, setQueryApplied] = useState('');
  const [personSelected, setPersonSelected] = useState(peopleFromServer[0]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const { name, born, died } = personSelected;

  const applyQuery = useCallback(
    queryDebounce((query) => {
      setQueryApplied(query);
      setIsDropdownVisible(true);
    }, 1000),
    [],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsDropdownVisible(false);
      setQueryValue(event.target.value);
      applyQuery(event.target.value);
    },
    [],
  );

  const handleInputFocus = useCallback(
    () => {
      setIsDropdownVisible(true);
    },
    [],
  );

  const handlePersonSelect = useCallback(
    (person: Person) => {
      setIsDropdownVisible(false);
      setPersonSelected(person);
      setQueryValue(person.name);
      setQueryApplied(person.name);
    },
    [],
  );

  const people = useMemo(
    () => filterPeopleByQuery(peopleFromServer, queryApplied),
    [queryApplied],
  );

  return (
    <main className="section">
      <h1 className="title">{`${name} (${born} - ${died})`}</h1>

      <div className="dropdown is-active">
        <SearchInput
          query={queryValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />

        {isDropdownVisible && (
          <DropdownMenu people={people} onSelect={handlePersonSelect} />
        )}
      </div>
    </main>
  );
};
