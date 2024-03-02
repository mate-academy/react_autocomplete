import React, { useCallback, useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeoplesList } from './components/PeoplesList';

let selectedPeople = 'No selected person';

// eslint-disable-next-line
const debounce = (callback: Function, delay: number) => {
  let timerId = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [applyedQuery, setApplyedQuery] = useState('');
  const [initialPeaople] = useState(peopleFromServer);
  const [isFocused, setIsFocused] = useState(true);

  const delay = 300;

  const applyQuery = useCallback(debounce(setApplyedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectedPeople = 'No selected person';
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = initialPeaople.filter(people =>
    people.name.toLocaleLowerCase().includes(applyedQuery.toLocaleLowerCase()),
  );

  const getChoosenPeople = useCallback((element: Person) => {
    selectedPeople = `${element.name} (${element.born} - ${element.died})`;
    setQuery(element.name);
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPeople}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              value={query}
              className="input"
              data-cy="search-input"
              onFocus={() => setIsFocused(false)}
              onChange={handleQueryChange}
              onBlur={() => {
                setTimeout(() => {
                  setIsFocused(true);
                }, 200);
              }}
            />
          </div>

          <PeoplesList
            peoples={filteredPeople}
            isFocused={isFocused}
            onChange={getChoosenPeople}
          />
        </div>

        {!filteredPeople.length && query && (
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
        )}
      </main>
    </div>
  );
};
