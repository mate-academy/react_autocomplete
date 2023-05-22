import React, { useState, useCallback, useMemo } from 'react';
import './App.scss';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { PeopleDropdown } from './components/PeopleDropdown';
import { Person } from './types/Person';

// You can change delay here
const delay = 700;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);

  const people = useMemo(() => (
    peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(appliedQuery.toLowerCase())))
  ), [appliedQuery]);

  const resetQuery = useCallback(() => {
    setAppliedQuery('');
    setQuery('');
  }, []);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [appliedQuery],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  const handleSelect = useCallback((person: Person) => {
    setSelectPerson(person);
    resetQuery();
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectPerson
          ? `${selectPerson.name} (${selectPerson.born} - ${selectPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={classNames('dropdown',
        { 'is-active': appliedQuery })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            value={query}
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <PeopleDropdown people={people} onSelect={handleSelect} />
        </div>
      </div>
    </main>
  );
};
