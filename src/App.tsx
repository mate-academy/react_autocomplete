import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Person>();

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">

        <h1 className="title" data-cy="title">
          {selectedUser
            ? (`${selectedUser.name} (${selectedUser.born} - ${selectedUser.died})`)
            : ('No selected person')}
        </h1>

        <Dropdown
          users={peopleFromServer}
          onSelected={setSelectedUser}
          delay={300}
          selectedPerson={selectedUser}
        />
      </main>
    </div>
  );
};
