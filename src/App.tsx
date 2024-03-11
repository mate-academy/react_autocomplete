import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay: number) {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsVisible(true);
    }, 1000); // Час в мілісекундах (за потреби змініть)

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPerson(undefined);
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsVisible(false);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person: Person) =>
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
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          {isFocused && isVisible && (
            <Dropdown people={filteredPeople} onSelected={setSelectedPerson} />
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
