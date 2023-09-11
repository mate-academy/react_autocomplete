import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownMenu } from './components/DropdownMenu/DropdownMenu';
import { SearchInput } from './components/SearchInput/SearchInput';
import { filterPeopleByQuery, queryDebounce } from './utils';

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

  const handleInputFocus = useCallback(() => {
    setIsDropdownVisible(true);
  }, []);

  const handlePersonSelect = useCallback((person: Person) => {
    setIsDropdownVisible(false);
    setPersonSelected(person);
    setQueryValue(person.name);
    setQueryApplied(person.name);
  }, []);

  const suggestions = useMemo(
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
          <DropdownMenu
            suggestions={suggestions}
            onSelect={handlePersonSelect}
          />
        )}
      </div>
    </main>
  );
};
