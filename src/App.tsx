import React, { useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownMenu } from './DropdownMenu/DropdownMenu';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const timerId = useRef(0);

  const handleQueryChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    window.clearTimeout(timerId.current);
    timerId.current = window.setTimeout(() => {
      setAppliedQuery(event.target.value);
    }, 500);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => {
      const readyQuery = appliedQuery.toLowerCase().trim();
      const personName = person.name.toLocaleLowerCase();

      return personName.includes(readyQuery);
    });
  }, [appliedQuery]);

  const onSubmit = useMemo(() => {
    return (person:Person) => {
      const { name } = person;

      setQuery(name);
      setSelectedPerson(person);
      setIsFocused(false);
    };
  }, []);

  const isSelectedPerson = query === selectedPerson?.name;

  return (
    <main className="section">
      <h1 className="title">
        {isSelectedPerson
          ? (`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
          : ('No selected person')}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            onFocus={() => setIsFocused(true)}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>
        <DropdownMenu
          filteredPeople={filteredPeople}
          onSubmit={onSubmit}
          isFocused={isFocused}
          selectedPerson={selectedPerson}
        />
      </div>
    </main>
  );
};
