import React, { useState, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PersonList } from './components/PersonList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');
  const delay = 1000;

  const filteredPeople = useMemo(() => {
    const newQuery = query.toLowerCase().trim();

    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(newQuery),
    );
  }, [appliedQuery]);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const selectPerson = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery('');
    setAppliedQuery('');
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {
          selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
            : 'No selected person'
        }
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              applyQuery(event.target.value);
            }}
          />
        </div>

        {appliedQuery
          && (
            <div className="dropdown-menu" role="menu">
              <PersonList
                people={filteredPeople}
                onSelect={selectPerson}
              />
            </div>
          )}
      </div>
    </main>
  );
};
