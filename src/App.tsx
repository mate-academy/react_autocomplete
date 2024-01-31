import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplate } from './component/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState('');

  const currentPerson = peopleFromServer.find(
    person => person.name === selectedPerson,
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {currentPerson
            ? (
              `${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`
            ) : (
              'No selected person'
            )}
        </h1>

        <Autocomplate
          onSelected={setSelectedPerson}
        />
      </main>
    </div>
  );
};
