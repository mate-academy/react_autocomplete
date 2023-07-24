import debounce from 'lodash.debounce';
import React, { useMemo, useState, useCallback } from 'react';
import './App.scss';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

const preparedPeople = (
  people: Person[],
  query: string,
) => {
  const peopleCopy = [...people].filter(person => (
    person.name.toLowerCase().includes(query.toLowerCase())
  ));

  return peopleCopy;
};

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const people = useMemo(() => (
    preparedPeople(peopleFromServer, appliedQuery)),
  [appliedQuery]);
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (name: string) => {
    setQuery(name);
    applyQuery(name);
  };

  return (
    <main className="section">
      <h1 className={classNames('title', {
        'has-text-link': selectedUser?.sex === 'm',
        'has-text-danger': selectedUser?.sex === 'f',
      })}
      >
        {selectedUser ? (
          `${selectedUser.name} (${selectedUser.born} = ${selectedUser.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <Dropdown
        people={people}
        query={query}
        selectedUser={selectedUser}
        setQuery={setQuery}
        setSelectedUser={setSelectedUser}
        handleQueryChange={handleQueryChange}
        appliedQuery={appliedQuery}
        setAppliedQuery={setAppliedQuery}
      />
    </main>
  );
};
