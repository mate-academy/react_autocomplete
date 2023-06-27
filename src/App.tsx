import React, { useCallback, useMemo, useState } from 'react';
import { debounce } from './utils';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropList } from './components/DropList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [querySearch, setQuerysearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(
    debounce(setQuerysearch, 1000),
    [],
  );

  const handleQuery = (event: { target: { value: string } }) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const visiblePeople = useMemo(
    () => {
      if (querySearch) {
        const normalizedQuery = querySearch.toLowerCase();

        return peopleFromServer.filter(
          person => person.name.toLowerCase().includes(normalizedQuery),
        );
      }

      return [];
    }, [querySearch],
  );

  const handlePerson = (person: Person): void => {
    setSelectedPerson(person);
    setQuerysearch('');
    setQuery(person.name);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
          : ('No person selected')}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQuery}
          />
        </div>

        {querySearch && (
          <DropList
            onSelected={handlePerson}
            visiblePeople={visiblePeople}
          />
        )}
      </div>
    </main>
  );
};
