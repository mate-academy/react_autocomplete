import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropDown } from './Components/DropDown';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];
  const [select, setSelect] = useState('');

  return (
    <main className="section">
      <h1 className="title">
        {`${name} (${born} = ${died})`}
      </h1>

      <DropDown
        people={peopleFromServer}

      />
    </main>
  );
};
