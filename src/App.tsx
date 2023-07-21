import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';

import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList';
import { Person } from './types/Person';

function debounce(callback: (...args: string[]) => void, delay: number) {
  let timeId = 0;

  return (...args: string[]) => {
    window.clearTimeout(timeId);

    timeId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [query, setQuery] = useState('');

  const isEmptyField = !!appliedQuery.trim();

  const handleSelected = useCallback((currentPerson: Person) => {
    setSelectedPerson(currentPerson);
    setAppliedQuery('');
    setQuery('');
  }, []);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    if (appliedQuery.trim()) {
      return peopleFromServer.filter(person => (
        person.name.toLowerCase()
          .includes(appliedQuery.trim().toLocaleLowerCase())
      ));
    }

    return peopleFromServer;
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown',
        {
          'is-active': appliedQuery,
        })}
      >
        <div className="dropdown-trigger">
          <input
            onChange={handleQueryChange}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
          />
        </div>

        {appliedQuery && isEmptyField && (
          <PeopleList
            people={filteredPeople}
            onSelected={handleSelected}
          />
        )}

      </div>
    </main>
  );
};
