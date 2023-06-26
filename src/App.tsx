import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown/Dropdown';
import { Person } from './types/Person';

const debounce = (callback: (state: string) => void, delay: number) => {
  let timeoutId: number;

  return (...args: string[]) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(callback, delay, ...args);
  };
};

type Props = {
  delay?: number,
};

export const App: React.FC<Props> = ({ delay = 1000 }) => {
  const [selectedPerson, setSelectedPerson] = useState<null | Person>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isApplied, setIsApplied] = useState(false);

  const isDropdownVisible = isApplied && appliedQuery;

  const onSelected = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery('');
    setAppliedQuery('');
    setIsApplied(false);
  }, [selectedPerson]);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsApplied(false);
  };

  const visiblePersons = useMemo(() => {
    const preparedQuery = appliedQuery.toLowerCase();

    setIsApplied(true);

    return peopleFromServer.filter(person => {
      const preparedPersonName = person.name.toLowerCase();

      return preparedPersonName.includes(preparedQuery);
    });
  }, [peopleFromServer, appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No matching suggestions'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleChange}
          />
        </div>

        {isDropdownVisible && (
          <Dropdown
            persons={visiblePersons}
            onSelected={onSelected}
          />
        )}

      </div>
    </main>
  );
};
