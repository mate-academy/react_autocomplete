import React, { useCallback, useMemo, useState } from 'react';
import { debounce } from './util/utils';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DrobList } from './components/DropList';

import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [querySearch, setQuerySearch] = useState<string>('');
  const [selectedPerson, setSlectedPerson] = useState<Person | null>(null);

  const applyQery = useCallback(
    debounce(setQuerySearch, 1000),
    [],
  );

  const handleQuery = (event: { target: { value: string } }) => {
    setQuery(event.target.value);
    applyQery(event.target.value);
  };

  const suggestedPeople = useMemo(
    () => {
      if (querySearch) {
        const queryLower = querySearch.toLowerCase();

        return peopleFromServer.filter(
          people => people.name.toLowerCase()
            .includes(queryLower),
        );
      }

      return [];
    }, [querySearch],
  );

  const handlePerson = (person: Person): void => {
    setSlectedPerson(person);
    setQuerySearch('');
    setQuery(person.name);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
          : ('No person is selected')}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            value={query}
            onChange={handleQuery}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>
        {querySearch && (
          <DrobList
            onSelected={handlePerson}
            suggestedPeople={suggestedPeople}
          />
        )}
      </div>
    </main>
  );
};
