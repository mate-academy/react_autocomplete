import React, { useState, useEffect, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { debounce, getFilteredPeople } from './helpers/Functions';
import { DropMenu } from './components/DropMenu';
import { Input } from './components/Input';

export const App: React.FC = () => {
  const [personName, setPersonName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [people, setPeople] = useState<Person[]>([...peopleFromServer]);
  const [isDropdownVisible, setDropdownVisible] = useState(true);
  const [selectedPersonSlug, setSelectedPersonSlug] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  useEffect(() => {
    const filteredPeople = getFilteredPeople(peopleFromServer, appliedQuery);

    setPeople(filteredPeople);
  }, [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (inputValue) {
      setPersonName(inputValue);
      applyQuery(inputValue);
    } else {
      setDropdownVisible(true);
      setSelectedPersonSlug('');
      setPersonName('');
      applyQuery('');
    }
  };

  const handlePersonSelected = (person: Person) => {
    setPersonName(person.name);
    setDropdownVisible(false);
    setSelectedPersonSlug(person.slug);
  };

  const findPerson = (slug: string) => {
    return people.find(person => person.slug === slug);
  };

  const selectedPerson = findPerson(selectedPersonSlug);
  const isShowDropMenu = isFocused && isDropdownVisible && people.length;

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <div className="dropdown is-active">
        <Input
          personName={personName}
          setIsFocused={setIsFocused}
          visiblePeople={people}
          handleQuery={handleQueryChange}
        />

        {isShowDropMenu && (
          <DropMenu
            visiblePeople={people}
            onSelected={handlePersonSelected}
          />
        )}
      </div>
    </main>
  );
};
