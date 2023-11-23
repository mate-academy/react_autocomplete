import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownContent }
  from './components/Dropdown-content/Dropdown-content';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce((value) => {
      setAppliedQuery(value);
      setIsDropdownVisible(true);
    }, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsDropdownVisible(false);
    applyQuery(event.target.value);
  };

  const handleFocus = () => {
    setIsDropdownVisible(true);
  };

  const handleOnSelect = (person: Person) => {
    setQuery(person.name);

    setIsDropdownVisible(false);
    setSelectedPerson(person);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person) => {
      const normalizedQuery = appliedQuery.toLowerCase().trim();

      return person.name.toLowerCase().includes(normalizedQuery);
    });
  }, [appliedQuery, peopleFromServer]);

  return (
    <main className="section">
      {selectedPerson ? (
        <h1 className="title">{`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}</h1>
      ) : (
        <h1 className="title">No selected person</h1>
      )}

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
          />
        </div>

        {isDropdownVisible && (
          <DropdownContent
            people={filteredPeople}
            onSelect={handleOnSelect}
          />
        )}
      </div>
    </main>
  );
};
