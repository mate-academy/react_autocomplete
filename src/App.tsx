/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-concat */
import cn from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import './App.scss';
import debounce from 'lodash/debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownMenu } from './DropdownMenu';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [visiblePeople, setVisiblePeople] = useState<Person[]>([]);

  const applyQuery = useCallback(
    debounce(setDebouncedQuery, 500),
    [],
  );
  const clearQuery = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, [debouncedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  useEffect(() => {
    setVisiblePeople(peopleFromServer.filter(
      person => person.name.toLowerCase()
        .includes(debouncedQuery.toLowerCase()),
    ));
  }, [debouncedQuery, peopleFromServer]);

  const selectPerson = useCallback((person: Person) => {
    setSelectedPerson(person);
    clearQuery();
  }, [setSelectedPerson, clearQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} `
        +
          `(  ${selectedPerson.born}` + `- ${selectedPerson.died}  )`
        )
          :
          (
            'No person is selected'
          )}
      </h1>

      <div className={cn(
        'dropdown',
        { 'is-active': debouncedQuery },
      )}
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
                  onClick={() => clearQuery()}
                />
              </span>
            )}
          </div>

        </div>

        {debouncedQuery
          && (
            <DropdownMenu
              onSelect={selectPerson}
              visiblePeople={visiblePeople}
            />
          ) }
      </div>
    </main>
  );
};
