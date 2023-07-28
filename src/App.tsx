import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { DropdownMenu } from './components/DropdownMenu';
import { peopleFromServer } from './data/people';

function debounce(callback: (...args: string[]) => void, delay: number) {
  let timer = 0;

  return (...args: string[]) => {
    window.clearTimeout(timer);

    timer = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [usedQuery, setUsedQuery] = useState('');

  const timerOfChange = useCallback(debounce(setUsedQuery, 1000), []);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    timerOfChange(event.target.value);
  };

  const filterPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.toLocaleLowerCase()
        .includes(usedQuery.toLocaleLowerCase()));
  }, [usedQuery]);

  const onSelected = useCallback((newPerson: Person) => {
    setSelectedPerson(newPerson);
    setQuery(newPerson.name);
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleOnChange}
          />
        </div>
        {filterPeople.length === 0
          ? <p className="has-text-danger">No matching suggestions</p>
          : (
            usedQuery && query !== selectedPerson?.name && (
              <DropdownMenu people={filterPeople} onSelected={onSelected} />
            )
          )}
      </div>
    </main>
  );
};
