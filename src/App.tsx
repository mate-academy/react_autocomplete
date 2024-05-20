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
    }

    return 'No selected person';
  };

  const filteredList = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name
        .toLocaleLowerCase()
        .includes(appliedQuery.toLocaleLowerCase()),
    );
  }, [appliedQuery]);

  const handleSelect = (person: Person | undefined) => {
    setSelectedPerson(person);
    if (person) {
      setAppliedQuery(person?.name);
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
          setAppliedQuery={setAppliedQuery}
          setSelectedPerson={setSelectedPerson}
        />
      </main>
    </div>
  );
};
