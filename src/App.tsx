import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import classNames from 'classnames';
import './App.scss';
import { Person } from './types/Person';
import { DropdownMenu } from './components/DropdownMenu';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handelQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsFocused(true);
    if (!event.target.value) {
      setSelectedPerson(null);
      setIsFocused(false);
    }
  };

  const handelSelectPerson = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setAppliedQuery(person.name);
    setIsFocused(false);
  };

  return (
    <main className="section">
      <h1 className="title">
        {(selectedPerson)
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person' }
      </h1>

      <div className={classNames(
        'dropdown',
        { 'is-active': isFocused },
      )}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handelQueryChange}
            onFocus={() => setIsFocused(true)}
          />
        </div>
        <DropdownMenu
          onSelect={handelSelectPerson}
          appliedQuery={appliedQuery}
        />
      </div>
    </main>
  );
};
