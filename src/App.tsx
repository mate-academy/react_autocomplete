import React, { useState, useCallback, useMemo } from 'react';
import { debounce } from 'debounce';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

import { PersonList } from './components/PersonList';
import './App.scss';

const filteredPeople = (people:Person[], query:string) => {
  let preparedFilter = [...people];
  const normQuery = query.trim().toLowerCase();

  if (query) {
    preparedFilter = preparedFilter.filter(
      person => person.name.toLowerCase().includes(normQuery),
    );
  }

  return preparedFilter;
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const delay = 500;

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay), [],
  );

  const handleQueryChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setAppliedQuery('');
  };

  const visiblePeople = useMemo(() => {
    return filteredPeople(peopleFromServer, query);
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        { selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
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
        {appliedQuery && (
          <PersonList
            visiblePeople={visiblePeople}
            onSelected={handleSelectPerson}
          />
        )}
      </div>
    </main>
  );
};
