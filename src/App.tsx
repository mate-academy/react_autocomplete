import React, { useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const peopleFromServerWithId = peopleFromServer.map(
    (person: Person, index: number) => {
      return { ...person, id: index };
    },
  );

  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const selectedPerson = peopleFromServerWithId.find(
    person => person.id === selectedPersonId,
  );
  const showPersonInfo = !selectedPerson
    ? 'No selected person'
    : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {showPersonInfo}
        </h1>
        <Autocomplete
          onSelect={setSelectedPersonId}
          peopleFromServerWithId={peopleFromServerWithId}
        />
      </main>
    </div>
  );
};
