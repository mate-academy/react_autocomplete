/* eslint-disable max-len */
import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { DropdownList } from './components/DropdownList';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const getPreparedPeople = (query: string) => {
  const preparedQuery = query.trim().toLowerCase();

  return peopleFromServer.filter(
    person => person.name.toLowerCase().includes(preparedQuery),
  );
};

const delay = 1000;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const handleSelectPerson = (
    pers: Person,
  ) => {
    setSelectedPerson(pers);
    setQuery(pers.name);
    setDebouncedQuery('');
  };

  const applyDebouncedQuery = useCallback(
    debounce(setDebouncedQuery, delay),
    [],
  );

  const handleQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyDebouncedQuery((event.target.value).trim());
  }, []);

  const visiblePeople = useMemo(
    () => getPreparedPeople(debouncedQuery), [debouncedQuery],
  );

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
          : 'No selected person'}
      </h1>

      <div
        className={classNames('dropdown', {
          'is-active': query && (query !== selectedPerson?.name),
        })}
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

        {debouncedQuery && (
          <DropdownList
            people={visiblePeople}
            onClick={handleSelectPerson}
          />
        )}
      </div>
    </main>
  );
};
