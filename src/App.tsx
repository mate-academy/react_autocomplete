import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const handleSelected = useCallback((currentPerson: Person) => {
    setSelectedPerson(currentPerson);
    setAppliedQuery('');
  }, []);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => (
      person.name.toLowerCase()
        .includes(appliedQuery.trim().toLocaleLowerCase())
    ));
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown',
        {
          'is-active': appliedQuery,
        })}
      >
        <div className="dropdown-trigger">
          <input
            onChange={handleQueryChange}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>

        {appliedQuery && (
          <PeopleList
            people={filteredPeople}
            onSelected={handleSelected}
          />
        )}

      </div>
    </main>
  );
};
