import React, { useCallback, useMemo, useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay: number) {
  let timeoutId = 0;

  return (...args: any) => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

const delay = 600;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filteredArray = useMemo(() => {
    return peopleFromServer
      .filter(person => {
        const name = person.name.toLowerCase().trim();
        const queryLowerCase = appliedQuery.toLowerCase().trim();

        return name.includes(queryLowerCase);
      });
  }, [appliedQuery]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [appliedQuery, delay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonClick = (
    person: Person,
  ) => {
    if (selectedPerson === person) {
      setSelectedPerson(null);

      return;
    }

    setSelectedPerson(person);
    setQuery(person.name);
    setIsDropdownActive(false);
  };

  return (
    <main className="section">
      <Autocomplete
        people={filteredArray}
        selectedPerson={selectedPerson}
        isDropdownActive={isDropdownActive}
        query={query}
        onQueryChange={handleQueryChange}
        onPersonClick={handlePersonClick}
        onFocus={() => setIsDropdownActive(true)}
        onBlur={() => setIsDropdownActive(false)}
      />
    </main>
  );
};
