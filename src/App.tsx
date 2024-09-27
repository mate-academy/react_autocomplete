import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const delay = 300;

  const [activePerson, setActivePerson] = useState({
    name: '',
    born: 0,
    died: 0,
  });

  const [personIsActive, setPersonIsActive] = useState(false);

  const handleSetPerson = (n: string, b: number, d: number) => {
    setActivePerson({
      name: n,
      born: b,
      died: d,
    });
    if (!n) {
      setPersonIsActive(false);
    } else {
      setPersonIsActive(true);
    }
  };

  const { name, born, died } = activePerson;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {personIsActive
            ? `${name} (${born} - ${died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          delay={delay}
          onSelect={handleSetPerson}
        />
      </main>
    </div>
  );
};
