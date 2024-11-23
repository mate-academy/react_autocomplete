import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

// eslint-disable-next-line @typescript-eslint/ban-types
const debounce = (callback: Function, delay: number = 300) => {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => callback(...args), delay);
  };
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery), [setAppliedQuery]);

  const handleSelection = (person: Person | null) => {
    setSelectedPerson(person);

    if (person) {
      setQuery(person.name);
      applyQuery(person.name);
    }
  };

  const getFilteredPeople = useMemo(
    () =>
      [...peopleFromServer].filter(person =>
        person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase()),
      ),
    [appliedQuery],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              value={query}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onChange={e => {
                const newValue = e.target.value;

                if (selectedPerson && newValue !== selectedPerson.name) {
                  setSelectedPerson(null);
                }

                setQuery(newValue);
                applyQuery(newValue);
              }}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {inputFocused && (
              <div
                className="dropdown-content"
                onMouseDown={e => e.preventDefault()}
              >
                <Autocomplete
                  filteredPeople={getFilteredPeople}
                  onSelected={handleSelection}
                />
              </div>
            )}
          </div>
        </div>

        {getFilteredPeople.length === 0 && (
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
