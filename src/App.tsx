import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { AutoComplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const initialPerson = peopleFromServer[0];
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || initialPerson;

  const handleSelectedPerson = (person: Person | null) => {
    setSelectedPerson(person);
  };

  const selectPerson = selectedPerson
    ? `${name} (${born} - ${died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectPerson}
        </h1>
        <AutoComplete onSelected={handleSelectedPerson} />
      </main>
    </div>
  );
};
