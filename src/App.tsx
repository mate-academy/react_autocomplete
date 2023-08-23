import debounce from 'lodash.debounce';
import React, { useState, useCallback, useMemo } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList/PeopleList';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson]
    = useState<Person | null>(null);

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    setAppliedQuery('');
  };

  const handleSelected = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsFocused(false);
  };

  const blurHandle = () => {
    setTimeout(() => setIsFocused(false), 300);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => {
      return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });
  }, [appliedQuery, peopleFromServer]);

  return (
    <main className="section">
      {
        selectedPerson
          ? (
            <h1 className="title">
              {`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
            </h1>
          )
          : (
            <h1 className="title">
              No selected person
            </h1>
          )
      }

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            onBlur={blurHandle}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          {isFocused && (
            <PeopleList
              people={filteredPeople}
              onSelect={handleSelected}
              appliedQuery={appliedQuery}
            />
          )}
        </div>
      </div>
    </main>
  );
};
