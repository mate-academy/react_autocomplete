import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { People } from './components/People/People';

const DEFAULT_VALUES = {
  QUERY: '',
  DELAY: 300,
  FOCUS: false,
  SELECTED_PERSON: null,
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
  const [searchInput, setSearchInput] = useState<string>(DEFAULT_VALUES.QUERY);
  const [immediateSearchInput, setimmediateSearchInput] =
    useState<string>(searchInput);
  const [delay, setDelay] = useState<number>(DEFAULT_VALUES.DELAY);
  const [isFocused, setIsFocused] = useState<boolean>(DEFAULT_VALUES.FOCUS);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(
    DEFAULT_VALUES.SELECTED_PERSON,
  );

  const applySearchInputChange = useMemo(
    () => debounce(setSearchInput, delay),
    [delay],
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventValue = event.target.value;

    setimmediateSearchInput(eventValue);
    applySearchInputChange(eventValue);
    setSelectedPerson(DEFAULT_VALUES.SELECTED_PERSON);
  };

  const people = useMemo(() => getPreparedData(searchInput), [searchInput]);
  const noMatches = people.length === 0;

  let titleMessage = 'No selected person';

  if (selectedPerson) {
    titleMessage = `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`;
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {titleMessage}
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
            step={50}
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
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          {!noMatches && !selectedPerson && isFocused && (
            <People
              people={people}
              onClick={(person: Person) => {
                setSearchInput(person.name);
                setimmediateSearchInput(person.name);
                setSelectedPerson(person);
              }}
            />
          )}
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
