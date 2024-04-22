import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.scss';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Dropdown } from './components/Dropdown/Dropdown';

const defaultDelay = 300;

export const debounce = (
  callback: (...args: Array<string>) => void,
  delay: number,
) => {
  let timeDebounce: ReturnType<typeof setTimeout>;

  return (...args: Array<string>) => {
    clearTimeout(timeDebounce);

    timeDebounce = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [query, setQuery] = useState<string>('');
  const [debounceQuery, setDebounceQuery] = useState<string>('');
  const [showPeople, setShowPeople] = useState<boolean>(false);
  const getDebounceQuery = useMemo(
    () => debounce(setDebounceQuery, defaultDelay),
    [setDebounceQuery],
  );

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showPeople && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showPeople, searchInputRef]);

  const handlerChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedPerson(null);

    getDebounceQuery(e.target.value);
  };

  const handlerOnBlur = () => {
    setShowPeople(false);
  };

  const handlerOnSelected = (person: Person) => {
    setSelectedPerson(person);
    setShowPeople(false);
  };

  const filteredPeople = peopleFromServer.filter((people: Person) => {
    return people.name.includes(debounceQuery);
  });

  const person = `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson ? person : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              ref={searchInputRef}
              onClick={() => setShowPeople(true)}
              onChange={handlerChangeQuery}
              onBlur={handlerOnBlur}
              type="text"
              value={query}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>
          {showPeople && !!filteredPeople.length && (
            <Dropdown data={filteredPeople} onSelected={handlerOnSelected} />
          )}
        </div>

        {!filteredPeople.length && <ErrorMessage />}
      </main>
    </div>
  );
};
