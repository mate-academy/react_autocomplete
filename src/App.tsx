import React, { useCallback, useMemo, useState } from 'react';

import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/PeopleList/PeopleList';

const filterPeople = (query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  return peopleFromServer.filter(person => {
    const normalizedName = person.name.trim().toLowerCase();

    return normalizedName.includes(normalizedQuery);
  });
};

export const App: React.FC = () => {
  const [delay] = useState(1000);
  const [selectedPerson, setSelectedPerson] = useState<null | Person>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery((event.target.value).trim());
  };

  const preparedPeople = useMemo(
    () => filterPeople(appliedQuery),
    [appliedQuery],
  );

  const handlePersonClick = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setAppliedQuery('');
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
            onChange={handleQueryChange}
          />
        </div>

        {appliedQuery && (
          <PeopleList
            people={preparedPeople}
            onClick={handlePersonClick}
          />
        )}
      </div>
    </main>
  );
};
