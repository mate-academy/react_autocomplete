import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import classNames from 'classnames';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown/Dropdown';

const DELAY = 1000;

export const App: React.FC = () => {
  const allPeople: Person[] = peopleFromServer;

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState<string>('');
  const [applyQuery, setApplyQuery] = useState<string>('');

  const filteredPeople = useMemo(() => allPeople.filter(
    person => person.name.toLowerCase().includes(query.toLowerCase().trim()),
  ), [applyQuery, allPeople]);

  const applySearch = useCallback(
    debounce(setApplyQuery, DELAY),
    [DELAY],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applySearch(event.target.value);
  };

  const handleSelectPerson = useCallback((person: Person) => {
    setQuery('');
    setSelectedPerson(person);
  }, []);

  return (
    <main className="section">
      {selectedPerson ? (
        <h1
          className={classNames('title', {
            'has-text-danger': selectedPerson?.sex === 'f',
            'has-text-link': selectedPerson?.sex === 'm',
          })}
        >
          {`${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`}
        </h1>
      ) : (
        <h1 className="title">
          No selected person
        </h1>
      )}

      <Dropdown
        filteredPeople={filteredPeople}
        query={query}
        onQuery={setQuery}
        applyQuery={applyQuery}
        onInputChange={handleInputChange}
        onSelectPerson={handleSelectPerson}
      />
    </main>
  );
};
