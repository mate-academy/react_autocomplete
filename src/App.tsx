import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Suggestions } from './components/suggestions/Suggestions';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(
    debounce((query: string) => {
      setAppliedQuery(query);
      if (!query) {
        setSelectedPerson(null);
      }
    }, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
    setSearchInput(event.target.value);
  };

  const searchedPeople = useMemo(() => {
    return peopleFromServer.filter(person => person
      .name.toLocaleLowerCase()
      .includes(appliedQuery.toLocaleLowerCase()));
  }, [peopleFromServer, appliedQuery]);

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
            value={searchInput}
            onChange={handleQueryChange}
          />
        </div>
        {appliedQuery && (
          <Suggestions
            people={searchedPeople}
            onSelected={(person: Person) => {
              setSelectedPerson(person);
              setAppliedQuery('');
              setSearchInput(person.name);
            }}
          />
        )}
      </div>
    </main>
  );
};
