import React, { useState, useMemo } from 'react';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/PeopleList';

export const App: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filterQuery = useMemo(() => {
    return peopleFromServer.filter(person => person.name.toLowerCase()
      .includes(inputQuery.toLowerCase()));
  }, [inputQuery]);

  const onSelect = (person: Person) => {
    setInputQuery(person.name);
    setSelectedPerson(person);
    setIsFocused(false);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
        ) : (
          'No matches found'
        )}

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
            value={inputQuery}
            onFocus={() => setIsFocused(true)}
            onChange={(event) => setInputQuery(event.target.value)}
          />
        </div>

        <PeopleList
          personList={filterQuery}
          onSelect={onSelect}
        />
      </div>
    </main>
  );
};
