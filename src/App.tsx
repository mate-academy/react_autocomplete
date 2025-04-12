import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';
import { DropDown } from './components/autocomplete';

export const App: React.FC = () => {
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const inputField = useRef<HTMLInputElement>(null);
  const debounceDelay = 300;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce((value: string) => setAppliedQuery(value), debounceDelay),
    [],
  );

  const handleChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = changeEvent.target.value.trim();

    setQuery(changeEvent.target.value);

    if (trimmedValue === '') {
      applyQuery('');
    } else {
      applyQuery(trimmedValue);
    }
  };

  let filteredPeople: Person[] = [];

  if (appliedQuery.trim() === '') {
    filteredPeople = peopleFromServer;
  } else {
    filteredPeople = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
    );
  }

  useEffect(() => {
    inputField.current?.focus();
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {!currentPerson ? (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            {`${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`}
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              ref={inputField}
              onChange={(changeEvent: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(changeEvent);
                setCurrentPerson(null);
              }}
            />
          </div>
          {filteredPeople.length !== 0 && (
            <DropDown people={filteredPeople} onSelected={setCurrentPerson} />
          )}
        </div>

        {filteredPeople.length === 0 ? (
          <div
            className="
                    notification
                    is-danger
                    is-light
                    mt-3
                    is-align-self-flex-start
                  "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        ) : null}
      </main>
    </div>
  );
};
