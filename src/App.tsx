import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const people = [...peopleFromServer];
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filteredNames = useMemo(() => {
    return people
      .filter(item => item.name.toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()));
  }, [appliedQuery]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
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
          <Dropdown
            people={filteredNames}
            selectPerson={selectPerson}
          />
        </div>
      </div>
    </main>
  );
};
