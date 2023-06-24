import React, { useCallback, useMemo, useState } from 'react';
import { DropdownMenu } from './components/DropdownMenu';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import './App.scss';

const getVisiblePeople = (people: Person[], query: string) => {
  const formattedQuery = query
    .toLowerCase()
    .replace(/\s{2,}/g, ' '); // replaces 2 and more spaces in row to 1

  return people
    .filter(person => {
      const formattedName = person.name.toLowerCase();

      return formattedName.includes(formattedQuery);
    });
};

const debounce = (
  func: React.Dispatch<React.SetStateAction<string>>,
  delay: number,
) => {
  let timerId: NodeJS.Timeout;

  return (query: string) => {
    clearTimeout(timerId);
    timerId = setTimeout(func, delay, query);
  };
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const visiblePeople = useMemo(() => {
    setIsSuggestionsVisible(true);

    return getVisiblePeople(peopleFromServer, appliedQuery);
  },
  [peopleFromServer, appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    applyQuery(value);
    setIsSuggestionsVisible(false);
  };

  const onSelected = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setIsSuggestionsVisible(false);
  };

  const isDropdownMenuVisible = isSuggestionsVisible && appliedQuery;

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (
            `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          ) : (
            'No selected person'
          )}
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

        {isDropdownMenuVisible && (
          <DropdownMenu
            people={visiblePeople}
            onSelected={onSelected}
          />
        )}
      </div>
    </main>
  );
};
