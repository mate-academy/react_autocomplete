import classNames from 'classnames';
import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete/Autocomplete';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

/* eslint-disable-next-line */
function debonce(callback: Function, delay: number) {
  let timerId = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setInterval(() => {
      callback(...args);
    }, delay);
  };
}

type Props = {
  delay: number;
};

export const App: React.FC<Props> = ({ delay }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const { name, born, died } = selectedPerson || {};

  const applyQuery = useCallback(debonce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const people = useMemo((): Person[] => {
    const normalizedQuery = appliedQuery.trim().toLowerCase();

    return peopleFromServer
      .filter(person => person.name.toLowerCase().includes(normalizedQuery));
  }, [peopleFromServer, appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${name} (${born} - ${died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <div className={classNames('dropdown', {
        'is-active': !!appliedQuery,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        {appliedQuery && !people.length ? (
          <div className="dropdown-menu">
            No matching suggestions
          </div>
        ) : (
          <Autocomplete
            people={people}
            query={appliedQuery}
            onSelected={(person) => setSelectedPerson(person)}
            setQuery={setQuery}
            applyQuery={applyQuery}
            setAppliedQuery={setAppliedQuery}
          />
        )}
      </div>
    </main>
  );
};
