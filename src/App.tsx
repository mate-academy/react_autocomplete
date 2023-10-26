import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Title } from './components/Title';
import { Dropdown } from './components/Dropdown';

export const App: React.FC = () => {
  const [visiblePersonIndex, setVisiblePersonIndex] = useState(-1);

  const name = peopleFromServer[visiblePersonIndex]?.name;
  const born = peopleFromServer[visiblePersonIndex]?.born;
  const died = peopleFromServer[visiblePersonIndex]?.died;

  const selectPerson = (slugSelect: string) => {
    const selectIndex
      = peopleFromServer.findIndex(person => person.slug === slugSelect);

    setVisiblePersonIndex(selectIndex);
  };

  return (
    <main className="section">
      <Title
        name={name}
        born={born}
        died={died}
      />

      <Dropdown
        handleButton={selectPerson}
        setPersonIndex={setVisiblePersonIndex}
        people={peopleFromServer}
      />
    </main>
  );
};
