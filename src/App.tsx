import React, { useCallback, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import cn from 'classnames';

import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList';
import { Person } from './types/Person';

const DELAY = 1000;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const [isListActive, setIsListActive] = useState(false);

  const filteredPeople: Person[] = useMemo(() => {
    return peopleFromServer.filter(person => person.name.toLowerCase()
      .includes(appliedQuery.trim().toLowerCase()));
  }, [appliedQuery]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, DELAY),
    [appliedQuery],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery('');
    setIsListActive(false);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={cn(
        'dropdown',
        { 'is-active': isListActive },
      )}
      >

        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsListActive(true)}
          />
        </div>

        <PeopleList
          filteredPeople={filteredPeople}
          onSelected={handlePersonSelect}
        />
      </div>
    </main>
  );
};
