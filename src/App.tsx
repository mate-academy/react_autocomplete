import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

// eslint-disable-next-line @typescript-eslint/ban-types
const debounce = (f: Function, delay: number) => {
  let timerId: any;

  return (...args: string[]) => {
    clearTimeout(timerId);
    timerId = setTimeout(f, delay, ...args);
  };
};

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [person, setPerson] = useState<Person | undefined>(undefined);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleSearchPeople = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  const onClickPerson = (currentPerson: Person) => setPerson(currentPerson);

  const visiblePeople = useMemo(() => {
    return peopleFromServer.filter(
      people => people.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [peopleFromServer, appliedQuery]);

  const title = useMemo(() => {
    if (person) {
      return `${person.name} (${person.born} = ${person.died})`;
    }

    if (query && !visiblePeople.length) {
      return 'No matching suggestions';
    }

    return 'No selected person';
  }, [query, person, visiblePeople]);

  return (
    <main className="section">
      <h1 className="title">
        {title}
      </h1>

      <div className={query ? 'dropdown is-active' : 'dropdown'}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleSearchPeople}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">

            {visiblePeople.map(people => (
              <div
                aria-hidden="true"
                className="dropdown-item"
                onClick={() => onClickPerson(people)}
                key={people.name}
              >
                <p
                  className="has-text-link"
                >
                  {people.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
