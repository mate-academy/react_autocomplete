import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList/PeopleList';
import { DebouncedInput } from './components/DebouncedInput/DebouncedInput';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const peoples = peopleFromServer;

  const filteredPeoples = useMemo(() => {
    return peoples.filter(person =>
      person.name.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [peoples, inputValue]);

  useEffect(() => {
    setSelectedPerson(null);
  }, [inputValue]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson !== null
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <DebouncedInput
              value={inputValue}
              onChange={setInputValue}
              onFocus={() => setIsOpen(true)}
              delay={300}
            />
          </div>
          {isOpen && filteredPeoples.length > 0 && (
            <PeopleList
              peoples={filteredPeoples}
              onSelected={setSelectedPerson}
              onClose={() => setIsOpen(false)}
            />
          )}
        </div>

        {filteredPeoples.length === 0 && (
          <div
            className="
              notification
              is-danger
              is-light
              mt-3
              is-align-self-flex-start"
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
