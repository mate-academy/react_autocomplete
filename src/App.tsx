import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [{ name, born, died }, setUser] = useState(peopleFromServer[0]);
  const [userIsSelected, setUserIsSelected] = useState(false);

  const handleOnSelected = (user: Person) => {
    setUserIsSelected(true);
    setUser(user);
  };

  return (
    <main className="section">
      <h1 className="title">
        {userIsSelected
          ? `${name} (${born} = ${died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        delay={1000}
        onSelected={handleOnSelected}
      />
    </main>
  );
};
