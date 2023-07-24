import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropList } from './components/DropList';

const debounce = (f: (...args: string[]) => void, delay: number) => {
  let timerId: NodeJS.Timeout;

  return (...args: string[]) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      f(...args);
    }, delay);
  };
};

const DEBOUNCE_DELAY = 1000;

export const App: React.FC = () => {
  const [findPerson, setFindPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [applieQuery, setApplieQuery] = useState('');

  const apllyQuery = useCallback(
    debounce(setApplieQuery, DEBOUNCE_DELAY),
    [],
  );

  const handleQuery = (event: { target: { value: string } }) => {
    setQuery(event.target.value);
    apllyQuery(event.target.value);
  };

  const filterPeople = useMemo(() => {
    return peopleFromServer
      .filter(people => people.name.toLowerCase()
        .includes(applieQuery.toLowerCase()));
  }, [applieQuery]);

  const handlePerson = (people: Person,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    event.preventDefault();
    setFindPerson(people);
    setApplieQuery('');
    setQuery(people.name);
  };

  return (
    <main className="section">
      <h1 className="title">
        {findPerson
          ? (`${findPerson.name} (${findPerson.born} - ${findPerson.died})`)
          : ('No person is selected')}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQuery}
          />
        </div>

        {applieQuery && (
          <DropList
            onSelected={handlePerson}
            filterPeople={filterPeople}
          />
        )}
      </div>
    </main>
  );
};
