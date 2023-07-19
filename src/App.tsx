import React, { useState, useCallback, useMemo } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

import { Dropdown } from './conponents/Dropdown';

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
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);
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

  const onSelected = useCallback((newPeron: Person) => {
    setSelectPerson(newPeron);
    setQuery(newPeron.name);
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        { selectPerson ? (
          `${selectPerson.name} (${selectPerson.born} = ${selectPerson.died})`
        ) : (
          'No selected person'
        )}
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

        <div className="dropdown-menu" role="menu">
          {filterPeople.length === 0
            ? (
              <p className="has-text-danger">No matching suggestions</p>
            ) : (
              usedQuery && query !== selectPerson?.name && (
                <Dropdown people={filterPeople} onSelected={onSelected} />
              )
            )}
        </div>
      </div>
    </main>
  );
};
