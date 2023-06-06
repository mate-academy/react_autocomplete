import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './components/DropdownMenu';
import { Person } from './types/Person';

const getPersonByName = (personName: string): Person | null => {
  return peopleFromServer.find(
    (person) => person.name === personName,
  ) || null;
};

const debounce = <T extends (...args: never[]) => void>(
  func: T,
  delay: number,
) => {
  let timerId: NodeJS.Timeout;

  return (...args: Parameters<T>): void => {
    clearTimeout(timerId);
    timerId = setTimeout(func, delay, ...args);
  };
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, 500), []);

  const handleQueryOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    applyQuery(value);
    setIsSuggestionsVisible(false);
  };

  const onSelected = (name: string) => {
    setSelectedPerson(getPersonByName(name));
    setQuery(name);
    setIsSuggestionsVisible(false);
  };

  const visiblePeople: Person[] = useMemo(() => {
    setIsSuggestionsVisible(true);

    return peopleFromServer.filter((person) => {
      const normalizedPerson = person.name.toLowerCase();
      const normalizedQuery = query
        .replace(/ /g, '')
        .toLowerCase();

      return normalizedPerson.includes(normalizedQuery);
    });
  }, [appliedQuery, peopleFromServer]);

  const isDropdownVisible = appliedQuery && isSuggestionsVisible;

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (
            `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          )
          : (
            'No selected person'
          )}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            name="query"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryOnChange}
          />
        </div>

        {isDropdownVisible && (
          <DropdownMenu
            people={visiblePeople}
            onSelected={onSelected}
          />
        )}
      </div>
    </main>
  );
};
