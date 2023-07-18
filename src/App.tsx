import React, { useState, useMemo, useCallback } from 'react';
import cn from 'classnames';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

function debounce(
  callback1: React.Dispatch<React.SetStateAction<string>>,
  callback2: React.Dispatch<React.SetStateAction<boolean>>,
  delay: number,
) {
  let timerId = 0;

  return (arg1: string, arg2: boolean) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback1(arg1);
      callback2(arg2);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [human, setHuman] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [isActice, setIsActive] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce(setAppliedQuery, setIsActive, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value, event.target.value.length > 2);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase())
    ));
  }, [appliedQuery]);

  const choosePerson = (person: Person | null) => {
    if (person !== null) {
      setHuman(person);
      setQuery(person.name);
      setIsActive(false);
    }
  };

  return (
    <main className="section">
      <h1 className="title">
        {human
          ? `${human.name} (${human.born} = ${human.died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown', { 'is-active': isActice })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {(filteredPeople.length === 0)
              ? (
                <div
                  className={cn('dropdown-item')}
                >
                  <p className="has-text-danger">
                    No matching suggestions
                  </p>
                </div>
              )
              : filteredPeople.map((person, index) => (
                <div
                  className={cn(
                    'dropdown-item',
                    { 'has-background-success': human?.name === person.name },
                  )}
                  key={person.name}
                  onClick={() => choosePerson(person)}
                  role="button"
                  onKeyDown={() => {}}
                  tabIndex={index}
                >
                  <p className="has-text-link">
                    {person.name}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
};
