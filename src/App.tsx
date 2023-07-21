import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleList } from './PeopleList';
import { Person } from './types/Person';

const DELAY = 1000;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, DELAY),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);

    setQuery('');
    setAppliedQuery('');
  };

  const filteredPeople = useMemo(() => {
    const normalizedQuery = appliedQuery.trim().toLowerCase();

    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [appliedQuery]);

  return (
    <main className="section">
      {selectedPerson ? (
        <h1 className="title">
          {`${selectedPerson.name} (born ${selectedPerson.born} - died ${selectedPerson.died})`}
        </h1>
      ) : (
        <h1 className="title">
          No selected person
        </h1>
      )}

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            value={query}
            onChange={handleQueryChange}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>

        {query.length > 0 && (
          <div className="dropdown-menu" role="menu">
            <PeopleList
              people={filteredPeople}
              onSelect={handlePersonSelect}
            />
          </div>
        )}
      </div>
    </main>
  );
};
