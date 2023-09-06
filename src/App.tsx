import React, { useMemo, useState, useCallback } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import './App.scss';

import { peopleFromServer } from './data/people';
import { PeopleList } from './components/peopleList';
import { Person } from './types/Person';

const DELAY = 1000;

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isListVisible, setIsListVisible] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce(setAppliedQuery, DELAY),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => (
    peopleFromServer
      .filter((person) => (
        person.name.toLowerCase().includes(appliedQuery.toLowerCase())
      ))
  ), [peopleFromServer, appliedQuery]);

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setIsListVisible(false);
    setAppliedQuery('');
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown', { 'is-active': isListVisible })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            value={inputValue}
            placeholder="Enter a part of the name"
            className="input"
            onFocus={() => setIsListVisible(true)}
            onChange={handleQueryChange}
            onBlur={() => setIsListVisible(false)}
          />
        </div>
        <PeopleList people={filteredPeople} onSelect={handleSelect} />
      </div>
    </main>
  );
};
