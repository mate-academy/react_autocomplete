import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);
  const message = person
    ? `${person?.name} (${person?.born} - ${person?.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {message}
        </h1>

        <Autocomplete
          delay={300}
          setPerson={setPerson}
          people={peopleFromServer}
        />
      </main>
    </div>
  );
};
