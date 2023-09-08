import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown/Dropdown';
import { debounce } from './services/debounce';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const customDelay = 1000;

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.toLowerCase()
        .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  const selectPerson = (personName: string) => {
    setSelectedPerson(
      peopleFromServer.find(person => {
        return person.name === personName;
      }),
    );

    setAppliedQuery(personName);
  };

  const applyQuery = useCallback(debounce(setAppliedQuery, customDelay), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleDropdownToggle = (isVisible: boolean) => {
    setIsDropdownVisible(isVisible);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleChange}
            onFocus={() => handleDropdownToggle(true)}
            onBlur={() => handleDropdownToggle(false)}
          />
        </div>

        {isDropdownVisible && (
          <Dropdown
            people={filteredPeople}
            onSelected={selectPerson}
          />
        )}
      </div>
    </main>
  );
};
