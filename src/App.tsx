import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson] = useState(peopleFromServer[0]);
  const [delay] = useState(300);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>
        <Autocomplete peopleFromServer={peopleFromServer} delay={delay} />
      </main>
    </div>
  );
};
