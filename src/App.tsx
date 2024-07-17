import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const delay = 300;

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const filteredPeople = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
  );

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
  };

  const handleChoose = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : `No selected person`}
        </h1>

        <Autocomplete
          peopleList={filteredPeople}
          query={query}
          onChange={handleChangeInput}
          onChoose={handleChoose}
        />

        {!filteredPeople.length && !selectedPerson && (
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
