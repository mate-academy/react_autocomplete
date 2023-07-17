import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/PeopleList';

type FilterParams = {
  query: string;
};

function filterPeople(people: Person[], { query }: FilterParams): Person[] {
  let resultPeople = [...people];
  const normalazidQuery = query.toLowerCase();

  if (query) {
    resultPeople = resultPeople.filter((person) => {
      const normalazidName = person.name.toLowerCase();

      return normalazidName.includes(normalazidQuery);
    });
  }

  return resultPeople;
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [preparedQuery, setPreparedQueary] = useState('');
  const setQueryToFilter = useCallback(
    debounce(setPreparedQueary, 1000),
    [],
  );

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const visiblePeople = useMemo(
    () => filterPeople(peopleFromServer, { query: preparedQuery }),
    [preparedQuery],
  );

  function handleOnChange(newQuery: string): void {
    setQuery(newQuery);
    setQueryToFilter(newQuery);
    setSelectedPerson(null);
  }

  function handleOnClick(person: Person): void {
    setSelectedPerson(person);

    setQuery(person.name.toString());
  }

  const dropdownList = (
    <PeopleList
      people={visiblePeople}
      onClick={(newPerson) => handleOnClick(newPerson)}
    />
  );

  const isToShowSugestion = preparedQuery
    && selectedPerson === null
    && query === preparedQuery;

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={(event) => handleOnChange(event.currentTarget.value)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          {isToShowSugestion
          && (visiblePeople.length > 0
            ? dropdownList
            : 'No matching suggestions')}
        </div>
      </div>
    </main>
  );
};
