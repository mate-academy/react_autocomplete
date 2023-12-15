import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];

  return (
    <main className="section">
      <h1 className="title">
        {`${name} (${born} = ${died})`}
      </h1>
      <Dropdown people={peopleFromServer} />
    </main>
  );
};
