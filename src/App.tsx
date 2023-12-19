import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown/Dropdown';

function preparePeople(people: Person[], query: string) {
  return people.filter(person => {
    return person.name.toLowerCase().includes(query.toLowerCase().trim());
  });
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [isDropdownShown, setIsDropdownShown] = useState(false);

  const applyQuery = useCallback(debounce(setQuery, 1000), []);

  const showDropdown = useCallback(
    debounce(() => setIsDropdownShown(true), 1000),
    [],
  );

  const hideDropdown = useCallback(
    debounce(() => setIsDropdownShown(false), 150),
    [],
  );

  const handleInputChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputValue(event.target.value);
    setIsDropdownShown(false);
    applyQuery(event.target.value);
    showDropdown();
  }, []);

  const handleFocusChange = useCallback(() => {
    setIsDropdownShown(true);
  }, []);

  const handleItemClick = useCallback((person: Person) => {
    if (selectedPerson !== person) {
      setSelectedPerson(person);
    }

    if (inputValue !== person.name) {
      setInputValue(person.name);
      setQuery(person.name);
    }

    setIsDropdownShown(false);
  }, [selectedPerson, inputValue]);

  const people = useMemo(() => {
    return preparePeople(peopleFromServer, query);
  }, [query]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <Dropdown
        people={people}
        isDropdownActive={isDropdownShown}
        value={inputValue}
        onInputChange={handleInputChange}
        hideDropdown={hideDropdown}
        onSelected={handleItemClick}
        onFocus={handleFocusChange}
      />
    </main>
  );
};
