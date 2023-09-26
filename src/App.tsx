import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/PeopleList';

function debounce(callback: (...args: string[]) => void, delay: number) {
  let timeId = 0;

  return (...args: string[]) => {
    window.clearTimeout(timeId);

    timeId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

function filterPeople(people: Person[], appliedQuery: string) {
  return people.filter((person) => person.name
    .toLowerCase()
    .includes(appliedQuery.toLowerCase()));
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return filterPeople(peopleFromServer, appliedQuery);
  }, [appliedQuery]);

  const onSelected = useCallback((newSelectPerson: Person) => {
    setSelectedPerson(newSelectPerson);
    setQuery(newSelectPerson.name);
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
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
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          {filteredPeople.length === 0 && (
            <p className="has-text-danger">No matching suggestions</p>
          )}

          {appliedQuery !== '' && query !== selectedPerson?.name && (
            <PeopleList people={filteredPeople} onSelected={onSelected} />
          )}
        </div>
      </div>
    </main>
  );
};
