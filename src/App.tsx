/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useCallback } from 'react';
import './App.scss';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { peopleFromServer } from './data/people';
import { DropdownList } from './components/DropdownList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [visiblePersons, setVisiblePersons] = useState<Person[] | []>([]);
  const delay = 500;

  const appliedQuery = useCallback(debounce(setDebouncedQuery, delay), []);
  const cleanQuery = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, [debouncedQuery]);
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    appliedQuery(event.target.value);
  };

  const selectPerson = useCallback((person: Person) => {
    setSelectedPerson(person);
    cleanQuery();
  }, [selectedPerson, cleanQuery]);

  useEffect(() => {
    setVisiblePersons(
      peopleFromServer.filter(person => person.name
        .toLocaleUpperCase()
        .includes(
          debouncedQuery.toLocaleUpperCase(),
        )),
    );
  }, [debouncedQuery, peopleFromServer]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} - (${selectedPerson.born} - ${selectedPerson.died})`
        ) : (
          <p>No selected person</p>
        )}
      </h1>

      <div
        className={
          classNames(
            'dropdown',
            { 'is-active': debouncedQuery },
          )
        }
      >
        <div className="dropdown-trigger">
          <div className="control has-icons-right">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onChange={handleQueryChange}
            />

            {query && (
              <span
                className="icon is-right"
                style={{ pointerEvents: 'all' }}
              >
                <button
                  type="button"
                  className="delete"
                  onClick={() => cleanQuery()}
                />
              </span>
            )}
          </div>

          {debouncedQuery && (
            <DropdownList
              onSelected={selectPerson}
              visiblePersons={visiblePersons}
            />
          )}
        </div>
      </div>
    </main>
  );
};
