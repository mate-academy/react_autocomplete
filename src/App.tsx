import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';

import './App.scss';

import { peopleFromServer } from './data/people';
import { debounce } from './services/debounce';
import { DropDown } from './components';
import { Person } from './types/Person';


export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showDropDown, setShowDropDown] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase())
    )
  }, [appliedQuery]);

  return (
    <main className="section">

      {selectedPerson ? (
        <h1 className="title">
          {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>
      ) : (
        <h1 className="title">No selected person</h1>
      )}

      <div className={classNames('dropdown', {
        'is-active': showDropDown
      })}>
        <div className="dropdown-trigger">
          <input
            onFocus={() => {
              setShowDropDown(true);
            }}
            onBlur={() => setShowDropDown(false)}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleChangeQuery}
          />
        </div>

        {filteredPeople.length > 0 ? (
          <DropDown
            items={filteredPeople}
            onSelect={setSelectedPerson}
            setQuery={setQuery}
          />
        ) : (
          <div className="dropdown-menu">
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </div>
    </main>
  );
};
