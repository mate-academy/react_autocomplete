import React, { useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { People } from './components/People';

const initialPeople: Person[] = peopleFromServer.map(person => ({
  ...person,
}));

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = debounce(setAppliedQuery, 1000);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
    setAppliedQuery('');
    setQuery('');
  };

  const filteredPeople = useMemo(() => {
    return initialPeople.filter(
      person => person.name.toLocaleLowerCase()
        .includes(appliedQuery.toLocaleLowerCase()),
    );
  }, [appliedQuery, initialPeople]);

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
            onChange={handleQueryChange}
          />
        </div>
        {appliedQuery && (
          <People
            people={filteredPeople}
            onSelected={handleSelectedPerson}
          />
        )}

      </div>
    </main>
  );
};
