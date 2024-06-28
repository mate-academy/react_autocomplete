import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './component/Autocomplete';
import React, { useState } from 'react';

export const App: React.FC = () => {
  const [peopleName, setPeopleName] = useState<Person | null>(null);

  const handlePeople = (name: Person | null) => {
    setPeopleName(name);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {peopleName !== null
            ? `${peopleName.name} (${peopleName.born} - ${peopleName.died})`
            : 'No selected person'}
        </h1>
        <Autocomplete peoples={peopleFromServer} handlePeople={handlePeople} />
      </main>
    </div>
  );
};
