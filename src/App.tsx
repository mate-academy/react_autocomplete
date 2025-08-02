import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

import { DropDownMenu } from './components/DropDownMenu';

export const App: React.FC = () => {
  const [selectedPersonIndex, setSelectedPersonIndex] = useState(0);
  const { name, born, died } = peopleFromServer[selectedPersonIndex];

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${name} (${born} - ${died})`}
        </h1>

        <DropDownMenu
          allPeople={peopleFromServer}
          onPersonChange={setSelectedPersonIndex}
        />
      </main>
    </div>
  );
};
