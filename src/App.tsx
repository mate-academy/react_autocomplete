import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import cn from 'classnames';

import { DropdownMenu } from './Components/DropdownMenu';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

import './App.scss';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const visiblePeople = useMemo(() => {
    return peopleFromServer.filter(person => (
      person.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    ));
  }, [appliedQuery]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const queryChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const onSelectPerson = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery('');
    setAppliedQuery('');
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={cn(
        'dropdown',
        { 'is-active': appliedQuery !== '' },
      )}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={queryChangeHandler}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <DropdownMenu
            visiblePeople={visiblePeople}
            onSelectPerson={onSelectPerson}
          />
        </div>
      </div>
    </main>
  );
};
