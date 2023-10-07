import React, { useCallback, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import cn from 'classnames';

import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './Components/DropdownMenu';
import { Person } from './types/Person';

const DELAY = 1000;

function filterPeople(peopleToFilter: Person[], query: string) {
  const normalizedQuery = query.toLowerCase().trim();

  return peopleToFilter
    .filter(({ name }) => name.toLowerCase().includes(normalizedQuery));
}

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const [isFocus, setIsFocus] = useState(false);

  const filteredPeople: Person[] = useMemo(() => {
    return filterPeople(peopleFromServer, appliedQuery);
  }, [appliedQuery]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, DELAY),
    [appliedQuery],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleFocusChange = () => {
    setIsFocus(true);
  };

  const handlePersonSelect = (person: Person) => {
    setCurrentUser(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsFocus(false);
  };

  const title = currentUser
    ? `${currentUser.name} (${currentUser.born} - ${currentUser.died})`
    : 'No selected person';

  return (
    <main className="section">
      <h1 className="title">
        {title}
      </h1>

      <div className={cn(
        'dropdown',
        { 'is-active': isFocus },
      )}
      >

        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocusChange}
          />
        </div>

        <DropdownMenu
          filteredPeople={filteredPeople}
          onSelected={handlePersonSelect}
        />
      </div>
    </main>
  );
};
