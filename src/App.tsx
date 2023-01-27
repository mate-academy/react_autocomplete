import React, { useState } from 'react';
import { Dropdown } from './components/Dropdown';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [
    selectedPersonName,
    setSelectedPersonName,
  ] = useState('Carolus Haverbeke');
  const [state] = React.useState({
    records: [
      {
        words: peopleFromServer.map(person => person.name),
      },
    ],
  });

  const { words } = state.records[0];

  const selectedPerson = peopleFromServer
    .find(person => person.name === selectedPersonName);

  return (
    <main className="section">
      <h1 className="title">
        {`${selectedPerson?.name} (${selectedPerson?.born} = ${selectedPerson?.died})`}
      </h1>

      <Dropdown
        words={words}
        placeholder="Enter search"
        delay={400}
        save={(name: string) => {
          setSelectedPersonName(name);
        }}
      />

    </main>
  );
};
