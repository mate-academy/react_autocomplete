import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { MemoizedDropdown as Dropdown } from './Components/Dropdown/Dropdown';

enum PersonInfo {
  noSelected = 'No selected person',
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | string>(
    PersonInfo.noSelected,
  );
  const [searchName, setSearchName] = useState('');
  const [searchQueryName, setSearchQueryName] = useState('');

  const showDropdown = typeof selectedPerson !== 'object'
    && searchQueryName.length > 0;

  const applyQueryName = useCallback(
    debounce(setSearchQueryName, 400),
    [],
  );

  function handleSearchNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchName(event.target.value);
    applyQueryName(event.target.value);
    setSelectedPerson('');
  }

  function handlePersonSelection(chosenPerson: Person) {
    return () => {
      setSelectedPerson(chosenPerson);
      setSearchName(chosenPerson.name);
    };
  }

  const saveSearchName = useCallback(handleSearchNameChange, []);
  const selectPerson = useCallback(handlePersonSelection, []);

  const selectedPersonInfo = typeof selectedPerson === 'object'
    ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
    : PersonInfo.noSelected;

  const filteredPersons = useMemo(() => {
    return peopleFromServer.filter(person => {
      const personRegister = person.name.toLowerCase().trim();
      const searchRegister = searchQueryName.toLowerCase().trim();

      return personRegister.includes(searchRegister);
    });
  }, [searchQueryName]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPersonInfo}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            value={searchName}
            onChange={saveSearchName}
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>

        {showDropdown && (
          <Dropdown
            filteredPersons={filteredPersons}
            selectPerson={selectPerson}
          />
        )}
      </div>
    </main>
  );
};
