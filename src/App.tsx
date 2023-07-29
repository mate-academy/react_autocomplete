import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './components/DropDownMenu';
import { Person } from './types/Person';

const debounce = <T extends (...args: never[]) => void>
(fn: T, delay: number) => {
  let timerID: number;

  return (searchQuery: string) => {
    clearTimeout(timerID);
    timerID = setTimeout(fn, delay, searchQuery);
  };
};

export const App: React.FC = () => {
  const [searchQuery, setsearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isVisibleSuggestions, setIsVisibleSuggestions] = useState(false);

  const applySearch = useCallback(
    debounce(setAppliedSearchQuery, 1000),
    [],
  );

  const getFilteredPeople = () => {
    setIsVisibleSuggestions(true);

    return peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(appliedSearchQuery.toLowerCase())));
  };

  const filteredPeople = useMemo(
    getFilteredPeople,
    [peopleFromServer, appliedSearchQuery],
  );

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setsearchQuery(person.name);
    setIsVisibleSuggestions(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsVisibleSuggestions(false);
    setsearchQuery(event.target.value);
    applySearch(event.target.value);
  };

  const isVisibleMenu = isVisibleSuggestions && appliedSearchQuery;

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
            value={searchQuery}
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
