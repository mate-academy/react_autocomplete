import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownContent } from './components/DropdownContent';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [people, setPeople] = useState([...peopleFromServer]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback((value) => debounce(() => {
    setAppliedQuery(value);
    setIsChanging(false);
  }, 1000)(), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChanging(true);

    setSelectedPerson(null);
    setPeople([...peopleFromServer]);
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setPeople([]);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(
      p => p.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, people]);

  return (
    <main className="section">
      <h1 className="title">
        {
          selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'
        }
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          {(!isChanging && !selectedPerson) && (
            <DropdownContent
              people={filteredPeople}
              onSelected={handleSelectPerson}
            />
          )}
        </div>
      </div>
    </main>
  );
};
