import cn from 'classnames';
import React, { useCallback, useState } from 'react';
import './App.scss';
import debounce from 'lodash/debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownMenu } from './Components/DropdownMenu';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(
    debounce(setDebouncedQuery, 500),
    [],
  );
  const clearQuery = () => {
    setQuery('');
    setDebouncedQuery('');
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  let visiblePeople: Person[] = [];

  if (debouncedQuery) {
    visiblePeople = peopleFromServer.filter(
      person => person.name.toLowerCase()
        .includes(debouncedQuery.toLowerCase()),
    );
  }

  const selectPerson = (person: Person) => {
    setSelectedPerson(person);
    clearQuery();
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} `
          + `(${selectedPerson.born}`
          + `- ${selectedPerson.died})`
        ) : (
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
              <button
                className="icon is-small is-right is-clickable button-custom"
                type="button"
                onClick={() => clearQuery()}
              >
                <i
                  className="fas fa-times"
                />
              </button>
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
