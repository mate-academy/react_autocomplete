import cn from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash/debounce';
import { DropdownList } from './Components/DropdownList';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const visiblePeople = useMemo(() => {
    const lowerQuery = query.toLocaleLowerCase();

    return peopleFromServer.filter(person => (
      person.name.toLocaleLowerCase().includes(lowerQuery)
    ));
  }, [appliedQuery]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 700),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const selectPerson = useCallback((person: Person) => {
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
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <DropdownList
            people={visiblePeople}
            selectPerson={selectPerson}
          />
        </div>
      </div>
    </main>
  );
};
