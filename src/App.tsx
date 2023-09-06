import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownInput } from './components/DropDownInput';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];

  return (
    <main className="section">
      <h1 className="title">
        {`${name} (${born} = ${died})`}
      </h1>

      <DropdownInput />
    </main>
  );
};
