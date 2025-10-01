import React, { useCallback, useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import Dropdown from './Dropdown/Dropdown';

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay: number = 300) {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (...args: any) {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

const DEBOUNCE_TIME = 300;

export const App: React.FC = () => {
  const [filteredPeople, setFilteredPeople] =
    useState<Person[]>(peopleFromServer);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | undefined>(
    undefined,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = debounce(setAppliedQuery, DEBOUNCE_TIME);

  useEffect(() => {
    if (!appliedQuery) {
      setFilteredPeople(peopleFromServer);

      return;
    }

    setFilteredPeople(
      peopleFromServer.filter((person: Person) =>
        person.name.trim().toLowerCase().includes(appliedQuery),
      ),
    );
  }, [appliedQuery]);

  const updateQuery = (input: string) => {
    const entry = input.trim().toLowerCase();

    if (selectedPerson) {
      setSelectedPerson(undefined);
    }

    if (entry !== appliedQuery) {
      applyQuery(entry);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const onSelect = useCallback((slug: string) => {
    const selected = peopleFromServer.find(
      (person: Person) => person.slug === slug,
    );

    setSelectedPerson(selected);
    setIsFocused(false);
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          <h1 className="title" data-cy="title">
            {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={ChangeEvent => updateQuery(ChangeEvent.target.value)}
              onFocus={handleFocus}
            />
          </div>

          {isFocused && filteredPeople.length > 0 && (
            <Dropdown
              onSelect={onSelect}
              selectedPerson={selectedPerson}
              suggestions={filteredPeople}
            />
          )}
        </div>

        {filteredPeople.length <= 0 && (
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
