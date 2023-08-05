import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types';
import { PeopleList } from './components/PeopleList/PeopleList';
import { filterPeople } from './utils';

type Props = {
  delay: number,
};

export const App: React.FC<Props> = ({ delay }) => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const titleText = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
    : 'No selected person';

  const filteredPeople = useMemo(
    () => filterPeople(peopleFromServer, { query: appliedQuery }),
    [appliedQuery, peopleFromServer],
  );

  const selectPerson = useCallback(person => {
    setSelectedPerson(person);
    setQuery('');
    setAppliedQuery('');
  }, []);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setAppliedQuery('');
    applyQuery(event.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {titleText}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>

        {isFocus && !query.trim() && (
          <PeopleList
            people={filteredPeople}
            onSelect={selectPerson}
          />
        )}

        {appliedQuery && (
          <PeopleList
            people={filteredPeople}
            onSelect={selectPerson}
          />
        )}
      </div>
    </main>
  );
};
