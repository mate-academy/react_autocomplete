import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown/Dropdown';
import { debounce } from './helpers/debounce';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const visablePeople = useMemo(() => {
    return peopleFromServer.filter(person => person.name
      .toLowerCase().includes(query.toLowerCase()));
  }, [appliedQuery]);

  const selectPerson = (personName: string) => {
    setSelectedPerson(
      peopleFromServer.find(person => person.name === personName),
    );
    setQuery('');
  };

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={e => {
              handleChange(e);
            }}
            onFocus={() => setIsDropdownActive(true)}
            onBlur={() => setIsDropdownActive(false)}
          />
        </div>

        {isDropdownActive && (
          <Dropdown
            people={visablePeople}
            onSelect={selectPerson}
          />
        )}
      </div>
    </main>
  );
};
