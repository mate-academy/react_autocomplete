import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown/Dropdown';

export const App: React.FC = () => {
  const people: Person[] = [...peopleFromServer];
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const delay = 300;
  const field = useRef<HTMLInputElement>(null);

  const filteredPeople = useMemo(() => {
    const normalizedQuery = appliedQuery.toLowerCase().trim();

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [appliedQuery, people]);

  const onPersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setIsDropdownActive(false);
  };

  useEffect(() => {
    field.current?.focus();
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson && !isChanged ? (
          <h1 className="title" data-cy="title" key={selectedPerson.slug}>
            {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            {`No selected person`}
          </h1>
        )}

        <Dropdown
          isDropdownActive={isDropdownActive}
          setIsDropdownActive={setIsDropdownActive}
          field={field}
          filteredPeople={filteredPeople}
          onSelected={onPersonSelect}
          setIsChanged={setIsChanged}
          delay={delay}
          inputValue={inputValue}
          setInputValue={setInputValue}
          appliedQuery={appliedQuery}
          setAppliedQuery={setAppliedQuery}
        />

        {filteredPeople.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
