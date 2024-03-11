import './App.scss';
import cn from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown/Dropdown';

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
  const [selectedPerson, setSlectedPerson] = useState<Person>();
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [isClickable, setIsClickable] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  useEffect(() => {
    const timerId = setTimeout(() => setIsClickable(true), 300);

    return () => clearTimeout(timerId);
  }, [query]);

  const filteredPeople: Person[] = useMemo(() => {
    return peopleFromServer.filter((person: Person) =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSlectedPerson(undefined);
    setQuery(value);
    applyQuery(value);
    setIsClickable(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={cn('dropdown', {
            'is-active': isDropdownActive && filteredPeople.length !== 0,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={selectedPerson?.name || query}
              onChange={handleChange}
              onFocus={() => setIsDropdownActive(true)}
              onBlur={() => setIsDropdownActive(false)}
            />
          </div>

          {isDropdownActive && isClickable && (
            <Dropdown people={filteredPeople} onSelected={setSlectedPerson} />
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
