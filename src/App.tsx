import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person[]>([]);

  const onSelected = (person: Person) => {
    setSelectedPerson([person]);
  };

  return (
    <main className="section">
      <h1 className="title">
        {
          selectedPerson.length > 0 ? `${
            selectedPerson[0].name
          } (${
            selectedPerson[0].born
          } - ${
            selectedPerson[0].died
          })` : 'No person selected'
        }
      </h1>

      <Autocomplete
        peopleFromServer={peopleFromServer}
        onSelected={onSelected}
      />
    </main>
  );
};
