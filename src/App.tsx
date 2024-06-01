import React, { useState } from 'react';
import './App.scss';

import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';
import { peopleFromServer } from './data/people';

const DEFAULT_DELAY = 300;

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  const { name, born, died } = selectedUser || {};

  const changeUser = (user: Person | null) => {
    setSelectedUser(user);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedUser ? `${name} (${born} - ${died})` : 'No selected person'}
        </h1>

        <Dropdown
          onSelected={changeUser}
          people={peopleFromServer}
          delay={DEFAULT_DELAY}
        />
      </main>
    </div>
  );
};
