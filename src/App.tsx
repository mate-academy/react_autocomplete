import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete/Autocomplete';

const NO_SELECTED_PERSON = 'No selected person';

export const App: React.FC = () => {
  const [peopleTarget, setPeopleTarget] = useState<number | null>(null);

  const { name, born, died } = peopleFromServer[peopleTarget ?? 0];

  const handlePeopleSelect = (event: string | null) => {
    if (event === null) {
      setPeopleTarget(null);

      return;
    }

    const select = peopleFromServer.findIndex(person => person.name === event);

    if (select === -1) {
      return;
    }

    setPeopleTarget(select);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {peopleTarget === null
            ? NO_SELECTED_PERSON
            : `${name} (${born} - ${died})`}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          delay={300}
          onSelected={handlePeopleSelect}
        />
      </main>
    </div>
  );
};
