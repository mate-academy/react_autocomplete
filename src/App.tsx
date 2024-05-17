import React from 'react';
import { useState, useMemo } from 'react';
import 'bulma';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | undefined>();
  const [appliedQuery, setAppliedQuery] = useState('');

  const getTitle = () => {
    if (selectedPerson) {
      const { name, born, died } = selectedPerson;

      return `${name} (${born} - ${died})`;
    } else {
      return 'No selected person';
    }
  };

  const filteredList = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name
        .toLocaleLowerCase()
        .includes(appliedQuery.toLocaleLowerCase()),
    );
  }, [appliedQuery]);

  const handleApliedQuery = (arg: string) => {
    setAppliedQuery(arg);
  };

  const handleSelect = (p: Person | undefined) => {
    setSelectedPerson(p);
    if (p) {
      setAppliedQuery(p?.name);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {getTitle()}
        </h1>
        <Dropdown
          onSelected={handleSelect}
          delay={300}
          filteredList={filteredList}
          setAppliedQuery={handleApliedQuery}
          setSelectedPerson={setSelectedPerson}
        />

        {!filteredList.length && (
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
