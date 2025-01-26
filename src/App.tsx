import React, { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import Dropdown from './components/Dropdown';

export const App: React.FC = () => {
  const [value, setValue] = useState('');
  const [listPeople, setListPeople] = useState<Person[]>(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    if (selectedPerson && value !== selectedPerson.name) {
      setSelectedPerson(null);
    }
  }, [value, selectedPerson]);

  const debouncedFilter = useMemo(
    () =>
      debounce((inputValue: string) => {
        const filtered = peopleFromServer.filter((person: Person) =>
          person.name.toLowerCase().includes(inputValue.toLowerCase()),
        );

        setListPeople(filtered);
      }, 300),
    [value],
  );

  useEffect(() => {
    debouncedFilter(value);

    return () => {
      debouncedFilter.cancel();
    };
  }, [value, debouncedFilter]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson && value !== '' ? (
          <h1 className="title" data-cy="title">
            {`${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <Dropdown
          filteredPeople={listPeople}
          value={value}
          setValue={setValue}
          setSelectedPerson={setSelectedPerson}
        />

        {listPeople.length === 0 && (
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
