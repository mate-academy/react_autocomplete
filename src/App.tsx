import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [index, setIndex] = useState<null | number>(null);
  const delay = 1000;

  let name = '';
  let born = '';
  let died = '';

  if (index !== null) {
    const selectedPerson = peopleFromServer[index];

    name = selectedPerson.name;
    born = selectedPerson.born.toString();
    died = selectedPerson.died.toString();
  }

  return (
    <main className="section">
      {index !== null ? (
        <h1 className="title">
          {`${name} (${born} - ${died})`}
        </h1>
      ) : (
        <h1 className="title">
          No selected person
        </h1>
      )}

      <Autocomplete
        setIndex={setIndex}
        delay={delay}
      />

    </main>
  );
};
