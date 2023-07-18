import React, { useCallback, useRef, useState } from 'react';
import classNames from 'classnames';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

function debounce(callback: (...args: any) => void, delay: number) {
  let timerId = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const prevQuery = useRef('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [openMenu, setOpenMenu] = useState(false);

  const apllyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryCahnge = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    if (event.target.value === prevQuery.current) {
      return;
    }

    prevQuery.current = event.target.value;
    apllyQuery(event.target.value);
  };

  const selectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  };

  const handleOnBlurInput = useCallback(
    debounce(setOpenMenu, 100),
    [],
  );

  const filteredPeople = peopleFromServer.filter(
    person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={classNames('dropdown', { 'is-active': openMenu })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryCahnge}
            onFocus={() => setOpenMenu(true)}
            onBlur={() => handleOnBlurInput(false)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length > 0
              ? (
                filteredPeople.map(person => (
                  <button
                    type="button"
                    className="dropdown-item button is-white"
                    key={person.slug}
                    onClick={() => selectPerson(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </button>
                ))
              )
              : (
                <div className="dropdown-item">
                  <p className="has-text-grey-lighter">
                    No matching suggestions
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </main>
  );
};
