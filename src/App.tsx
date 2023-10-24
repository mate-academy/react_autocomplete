import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/PeopleList/PeopleList';

function debounce(callback: (arg: string) => void, delay: number) {
  let timerId = 0;

  return (arg: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(arg);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [shownList, setShownList] = useState(false);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => person.name
      .toLowerCase().includes(appliedQuery.toLowerCase().trim()));
  }, [appliedQuery]);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}

      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input is-rounded is-primary"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setShownList(true)}
            onBlur={() => setShownList(false)}

          />
        </div>

        {shownList && (
          <div className="dropdown-menu" role="menu">
            <PeopleList
              people={filteredPeople}
              setSelectedPerson={setSelectedPerson}
              setShownList={setShownList}
              setQuery={setQuery}
            />
          </div>
        )}
      </div>
    </main>
  );
};
