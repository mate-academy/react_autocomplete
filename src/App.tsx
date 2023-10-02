import './App.scss';
import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import { debounce } from 'lodash';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownMenu } from './Components/DropdownMenu';

const TIME_DELAY = 1000;

function filterPeople(peopleToFilter: Person[], query: string) {
  const transformedQuery = query.toLowerCase().trim();

  return peopleToFilter
    .filter(({ name }) => name.toLowerCase().includes(transformedQuery));
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [hasFocus, setHasFocus] = useState(false);

  const handleFocus = () => {
    setHasFocus(true);
  };

  const filteredPeople: Person[] = useMemo(() => {
    return peopleFromServer
      ? filterPeople(peopleFromServer, appliedQuery)
      : [];
  }, [appliedQuery]);

  const applyQuery = debounce(setAppliedQuery, TIME_DELAY);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(pervQuery => person.name || pervQuery);
    setHasFocus(false);
  };

  const selectedPersonDetails = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <main className="section">
      <h1 className="title">
        {selectedPersonDetails}
      </h1>

      <div className={cn('dropdown', { 'is-active': hasFocus })}>

        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
          />
        </div>

        <DropdownMenu
          filteredPeople={filteredPeople}
          onSelectPerson={handlePersonSelect}
        />
      </div>
    </main>
  );
};
