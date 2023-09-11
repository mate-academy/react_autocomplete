import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { PeoplesNames } from './types/Person';

const DELAY = 1000;

const peoplesNames: PeoplesNames[] = peopleFromServer.map(({
  name,
  slug,
  sex,
}) => ({
  name,
  slug,
  sex,
}));

export const App: React.FC = () => {
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const selectedPerson = peopleFromServer
    .find(person => person.slug === selectedPersonId);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>
      <Autocomplete
        peoplesNames={peoplesNames}
        onSelected={setSelectedPersonId}
        delay={DELAY}
      />
    </main>
  );
};
