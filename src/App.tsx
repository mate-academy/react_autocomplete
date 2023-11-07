import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/dropdown';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);

  const people = useMemo(() => (
    peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(query.toLowerCase())
    ))
  ), [debouncedQuery]);

  const applyQuery = useCallback(
    debounce(setDebouncedQuery, 500),
    [debouncedQuery],
  );

  const resetQuery = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const select = useCallback((person: Person) => {
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
        { 'is-active': debouncedQuery !== '' })}
      >
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
          <Dropdown people={people} onSelect={select} />
        </div>
      </div>
    </main>
  );
};
