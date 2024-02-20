import React, { useState } from 'react';
import './App.scss';
import { AutoComplete } from './component/Autocomplete';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const { name, born, died } = selectedPerson || peopleFromServer[0];

  const handleSelectedPerson = (person: Person | null) => {
    setSelectedPerson(person);
  };

  const selectPerson = selectedPerson ? `${name} (${born} - ${died})` : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectPerson}
        </h1>

        <AutoComplete
          onSelected={handleSelectedPerson}
        />
      </main>
    </div>

  );
};
