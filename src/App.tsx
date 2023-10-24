import React, { useState, useEffect } from 'react';
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
  const [visiblePeople, setVisiblePeople]
    = useState<Person[]>([...peopleFromServer]);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedPersonSlug, setSelectedPersonSlug] = useState('');

  const applyQuery = debounce(setAppliedQuery, 1000);
  // not sure how to do it, just wait for a class

  useEffect(() => {
    const filteredPeople = getFilteredPeople(peopleFromServer, appliedQuery);

    setVisiblePeople(filteredPeople);
  }, [appliedQuery]);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPersonName(event.target.value);

    applyQuery(event.target.value);
    if (event.target.value === '') {
      setIsVisible(true);
      setSelectedPersonSlug('');
    }
  };

  const findPerson = (slug: string) => {
    return visiblePeople.find(person => person.slug === slug);
  };

  const selectedPerson = findPerson(selectedPersonSlug);
  const isShowDropMenu = isFocused && isVisible && visiblePeople.length !== 0;

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
          visiblePeople={visiblePeople}
          handleQuery={handleQuery}
        />

        {isShowDropMenu && (
          <DropMenu
            visiblePeople={visiblePeople}
            onSelected={(person) => {
              setPersonName(person.name);
              setIsVisible(false);
              setSelectedPersonSlug(person.slug);
            }}
          />
        )}
      </div>
    </main>
  );
};
