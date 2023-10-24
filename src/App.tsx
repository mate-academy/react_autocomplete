import React, { useState } from 'react';
import {
  PeopleAutocomplete,
} from './components/PeopleAutocomplete/PeopleAutocomplete';
import { peopleFromServer } from './data/people';
import './App.scss';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {person
          ? `${person.name} (${person.born} - ${person.died})`
          : 'No selected person'}
      </h1>

      <PeopleAutocomplete
        people={peopleFromServer}
        delay={500}
        onSelect={setPerson}
      />
    </main>
  );
};
