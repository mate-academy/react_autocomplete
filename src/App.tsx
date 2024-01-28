import React, { useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PersonList } from './components/PersonList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [persons, setPersons] = useState<Person[]>(peopleFromServer);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const timerId = useRef(0);
  const [focus, setFocus] = useState(false);
  const delay = 1000;

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.trim());
    setFocus(true);
    setPersons(peopleFromServer);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setAppliedQuery(event.target.value);
    }, delay);
  };

  const filteredPersons = useMemo(() => {
    return persons.filter(person => person.name.toLowerCase()
      .includes(appliedQuery));
  }, [appliedQuery, persons]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <div className={cn('dropdown', {
        'is-active': focus,
      })}
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
          <div className="dropdown-content">
            <PersonList
              persons={filteredPersons}
              onSelect={setSelectedPerson}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
