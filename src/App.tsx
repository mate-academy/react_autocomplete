import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { SelectForm } from './components/SelectForm';

export const App: React.FC = () => {

  const [selectPerson, setSelectPerson] = useState<Person | null>(null);

  const onSelectPerson = (person: Person) => {
    setSelectPerson(person);
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          
          {`${selectPerson?.name} (${selectPerson?.born} - ${selectPerson?.died})`}
        </h1>

        <SelectForm peoples={peopleFromServer} onSelect={onSelectPerson} />

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
      </main>
    </div>
  );
};
