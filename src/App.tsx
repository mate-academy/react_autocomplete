import { debounce } from '@mui/material';
import cn from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';

import './App.scss';
import { PeopleList } from './components/PeopleList/PeopleList';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const applyFocused = useCallback(
    debounce(setIsFocused, 1000),
    [],
  );

  const handleQuery = ((event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setQuery(event.target.value);
    applyQuery(event.target.value);
    applyFocused(true);
  });

  const handleSelected = (newPersonName: string) => {
    setSelectedPerson(peopleFromServer
      .find(person => person.name === newPersonName));
    setQuery(newPersonName);
    setIsFocused(false);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(human => {
      return human.name.toLowerCase()
        .includes(appliedQuery.toLowerCase());
    });
  }, [appliedQuery, peopleFromServer]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown', {
        'is-active': isFocused,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        <PeopleList
          people={filteredPeople}
          onSelect={handleSelected}
        />
      </div>
    </main>
  );
};
