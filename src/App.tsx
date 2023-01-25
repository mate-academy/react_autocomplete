import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropDownMenu } from './components/DropDownMenu';
import { useDebounce } from './hooks/useDebounce';

const search = (people: Person[], searchTerm: string) => {
  const lowerQuery = searchTerm.trim().toLocaleLowerCase();

  // prettier-ignore
  return people.filter((person) => person
    .name
    .toLocaleLowerCase()
    .includes(lowerQuery));
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 300);

  const onSelect = useCallback(
    (person: Person) => {
      setSelectedPerson(person);
    },
    [debouncedQuery],
  );

  const filteredPeople = useMemo(() => {
    return search(peopleFromServer, debouncedQuery);
  }, [debouncedQuery]);

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
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </div>

        {query && (
          <DropDownMenu
            people={filteredPeople}
            onSelect={onSelect}
          />
        )}
      </div>
    </main>
  );
};
