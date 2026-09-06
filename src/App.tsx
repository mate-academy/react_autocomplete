import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { People } from './components/People/People';

const DEFAULT_VALUES = {
  QUERY: '',
  DELAY: 300,
};

function getPreparedData(query: string): Person[] {
  if (query === DEFAULT_VALUES.QUERY) {
    return peopleFromServer;
  }

  return peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(query.toLowerCase()),
  );
}

function debounce(
  callback: React.Dispatch<React.SetStateAction<string>>,
  delay: number,
) {
  let timeOut = 0;

  return (eventValue: string) => {
    clearTimeout(timeOut);

    timeOut = window.setTimeout(() => callback(eventValue), delay);
  };
}

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];
  const [searchInput, setSearchInput] = useState<string>(DEFAULT_VALUES.QUERY);
  const [immediateSearchInput, setimmediateSearchInput] =
    useState<string>(searchInput);
  const [delay, setDelay] = useState<number>(DEFAULT_VALUES.DELAY);

  const applySearchInputChange = useMemo(
    () => debounce(setSearchInput, delay),
    [delay],
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventValue = event.target.value;

    setimmediateSearchInput(eventValue);
    applySearchInputChange(eventValue);
  };

  const people = useMemo(() => getPreparedData(searchInput), [searchInput]);
  const noMatches = people.length === 0;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${name} (${born} - ${died})`}
        </h1>
        <div className="delay">
          <label htmlFor="delayInput">Delay: </label>
          <input
            id="delayInput"
            type="number"
            className="input"
            style={{ width: '100px' }}
            onChange={event => setDelay(+event.target.value)}
            value={delay}
          />
        </div>
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleSearchChange}
              value={immediateSearchInput}
            />
          </div>

          {!noMatches && <People people={people} />}
        </div>

        {noMatches && (
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
