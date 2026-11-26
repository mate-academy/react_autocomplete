/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete/Autocomplete';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
// import debounce from 'lodash.debounce';
// import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const titleText = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1
          className="title"
          data-cy="title"
          data-qa="title"
        >
          {titleText}
        </h1>
        <Autocomplete
          people={peopleFromServer}
          delay={300}
          onSelected={setSelectedPerson}
        />
      </main>
    </div>
  );
};
