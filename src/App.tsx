import debounce from 'lodash.debounce';
import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { PersonList } from './components/PersonList/PersonList';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocusInput, setIsFocusInput] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000), [],
  );

  const selectPerson = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsFocusInput(false);
  }, []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsFocusInput(false);

    if (selectedPerson && event.target.value === selectedPerson.name) {
      return;
    }

    setIsFocusInput(true);
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (selectedPerson && e.target.value === selectedPerson.name) {
      return;
    }

    setIsFocusInput(true);
  };

  const filteredPeople = useMemo(() => {
    const newQuery = appliedQuery.toLocaleLowerCase().trim();

    return peopleFromServer.filter(
      person => person.name.toLocaleLowerCase().includes(newQuery),
    );
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No person selected'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleInputFocus}
          />
        </div>
        {isFocusInput && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-menu" role="menu">
              <PersonList people={filteredPeople} onSelect={selectPerson} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
