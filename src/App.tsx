import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const debounce = (func:React.Dispatch<React.SetStateAction<string>>,
  delay:number) => {
  let timerId: number;

  return (...args:string[]) => {
    clearTimeout(timerId);
    timerId = setTimeout(func, delay, ...args);
  };
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selected, setSelected] = useState<Person>();

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const visiblePeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [peopleFromServer, appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selected
          ? `${selected.name} (${selected.born} = ${selected.died})`
          : 'No selected person'}
      </h1>

      <div
        className={appliedQuery ? 'dropdown is-active' : 'dropdown'}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              applyQuery(event.target.value);
            }}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {visiblePeople.length >= 1
              ? visiblePeople.map(person => (
                <div
                  key={person.name}
                  className="dropdown-item"
                >
                  <a
                    href="/"
                    onClick={(event) => {
                      event.preventDefault();
                      setSelected(person);
                      setAppliedQuery('');
                    }}
                  >
                    <p
                      className={person.sex === 'f'
                        ? 'has-text-danger'
                        : 'has-text-link'}
                    >
                      {person.name}
                    </p>
                  </a>
                </div>
              ))
              : (
                <div className="dropdown-item">
                  No matching suggestions
                </div>
              )}
          </div>
        </div>
      </div>
    </main>
  );
};
