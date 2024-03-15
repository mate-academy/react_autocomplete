import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './components/DropdownMenu';
import { Person } from './types/Person';

// eslint-disable-next-line @typescript-eslint/ban-types
const debounce = (callback: Function, delay: number) => {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);
  const activateVisible = useCallback(debounce(setIsVisible, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsVisible(false);
    setQuery(event.target.value);
    setSelectedPerson(undefined);
    applyQuery(event.target.value);
    activateVisible(true);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={selectedPerson?.name || query}
              onChange={handleQueryChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          {isFocused && isVisible && (
            <DropdownMenu
              people={filteredPeople}
              onSelected={setSelectedPerson}
            />
          )}
        </div>

        {filteredPeople.length === 0 && (
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
