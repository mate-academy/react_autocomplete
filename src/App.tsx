import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './components/DropdownMenu';
import { Person } from './types/Person';

const debounce = <T extends (...args: never[]) => void>
(func: T, delay: number) => {
  let timerID: number;

  return (searchQuery: string) => {
    clearTimeout(timerID);
    timerID = setTimeout(func, delay, searchQuery);
  };
};

export const App: React.FC = () => {
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isVisibleSuggestions, setIsVisibleSuggestions] = useState(false);

  const applySearch = useCallback(
    debounce(setAppliedSearch, 1000),
    [],
  );

  const getFilteredPeople = () => {
    setIsVisibleSuggestions(true);

    return peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(appliedSearch.toLowerCase())));
  };

  const filteredPeople = useMemo(
    getFilteredPeople,
    [peopleFromServer, appliedSearch],
  );

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setSearch(person.name);
    setIsVisibleSuggestions(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsVisibleSuggestions(false);
    setSearch(event.target.value);
    applySearch(event.target.value);
  };

  const isVisibleMenu = isVisibleSuggestions && appliedSearch;

  return (
    <main className="section">
      {selectedPerson
        ? (
          <h1 className="title">
            {`${selectedPerson?.name} (${selectedPerson?.born} = ${selectedPerson?.died})`}
          </h1>
        ) : (<h1 className="title">No selected person</h1>)}

      <div className={cn('dropdown', {
        'is-active': isVisibleSuggestions,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={search}
            onChange={handleInputChange}
          />
        </div>

        {isVisibleMenu && (
          <DropdownMenu people={filteredPeople} onSelected={handleSelect} />
        )}
      </div>
    </main>
  );
};
