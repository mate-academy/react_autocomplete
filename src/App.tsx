import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './Components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | undefined>(
    undefined,
  );
  const [userValue, setUserValue] = useState('');

  const handleFiltered = (value: string) => {
    setUserValue(value);
  };

  const memoizedFilteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => {
      return person.name
        .toLocaleLowerCase()
        .includes(userValue.toLocaleLowerCase());
    });
  }, [userValue]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {!selectedPerson
            ? 'No selected person'
            : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>

        <Autocomplete
          persons={memoizedFilteredPeople}
          setSelectedPerson={setSelectedPerson}
          delay={300}
          handleFiltered={handleFiltered}
        />

        {memoizedFilteredPeople.length > 0 ? (
          ''
        ) : (
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
