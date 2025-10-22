import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);

  const hadleSelect = (element: Person | null) => {
    setSelectPerson(element);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-qa="title">
          {selectPerson
            ? `${selectPerson.name} (${selectPerson.born} - ${selectPerson.died})`
            : `No selected person`}
        </h1>

        <Autocomplete
          persons={peopleFromServer}
          onSelected={hadleSelect}
          delay={300}
        />
      </main>
    </div>
  );
};
