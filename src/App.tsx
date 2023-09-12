import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown/Dropdown';

function filterPeopleByQuery(people: Person[], query: string) {
  return people
    .filter(({ name }) => name
      .toLowerCase()
      .includes(query.toLowerCase().trim()));
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [hasFocus, setHasFocus] = useState(false);

  const filteredPeople: Person[] = useMemo(() => {
    return filterPeopleByQuery(peopleFromServer, appliedQuery);
  }, [appliedQuery]);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setHasFocus(false);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} ${selectedPerson.born} - ${selectedPerson.died}`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown', { 'is-active': hasFocus })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
          />
        </div>
        <Dropdown
          people={filteredPeople}
          onSelect={handlePersonSelect}
        />
      </div>
    </main>
  );
};
