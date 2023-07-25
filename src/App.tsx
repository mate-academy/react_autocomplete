import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './components/DropdownMenu';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isEntering, seIsEntering] = useState(false);

  const selectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery('');
    setAppliedQuery('');
  };

  const applyQuery = useCallback(
    debounce((value) => {
      setAppliedQuery(value);
      seIsEntering(false);
    }, 1000),
    [],
  );

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    seIsEntering(true);
    setQuery(e.target.value);
    applyQuery(e.target.value);
  }, []);

  const filteredPeople = peopleFromServer.filter(person => (
    person.name
      .toLowerCase()
      .includes(appliedQuery.toLowerCase())
  ));

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
            onChange={handleInput}
            value={query}
          />
        </div>

        {!isEntering && (
          <DropdownMenu
            people={filteredPeople}
            onSelect={selectPerson}
          />
        )}
      </div>
    </main>
  );
};
