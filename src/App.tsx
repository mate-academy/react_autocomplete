import { FC, useState, useMemo, useCallback } from 'react';

import { peopleFromServer } from './data/people';

import { Person } from './types/Person';

import { Dropdown } from './components';

import './App.scss';

export const App: FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filteredPerson = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [query]);

  const handleSelectPerson = useCallback((person: Person | null) => {
    setSelectedPerson(person);
  }, []);

  const handleChangeQuery = useCallback((str: string) => {
    setQuery(str);
  }, []);

  const selectedPersonInfo = useMemo(() => {
    return selectedPerson
      ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
      : 'No selected person';
  }, [selectedPerson]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPersonInfo}
        </h1>

        <Dropdown
          people={filteredPerson}
          filteredPerson={filteredPerson}
          onSelectPerson={handleSelectPerson}
          onChangeQuery={handleChangeQuery}
        />

        {!filteredPerson.length && (
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
