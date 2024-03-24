import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { AutoComplete } from './Autocomplete/Autocomplete';

export const App: React.FC = () => {
  const [isSelectedPerson, setIsSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = isSelectedPerson || peopleFromServer[0];

  const handleSelectedPerson = (person: Person | null) => {
    setIsSelectedPerson(person);
  };

  const selectedPerson: string = isSelectedPerson
    ? `${name} (${born} - ${died})`
    : `No selected person`;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson}
        </h1>

        <AutoComplete onSelected={handleSelectedPerson} />
      </main>
    </div>
  );
};
