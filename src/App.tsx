import React, { useState } from 'react';
import './App.scss';

import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {/* {`${name} (${born} - ${died})`} */}
          {selectedUser
            ? `${selectedUser?.name} (${selectedUser?.born} - ${selectedUser?.died})`
            : 'No selected person'}
        </h1>

        <Dropdown
          onSelected={setSelectedUser}
          items={peopleFromServer}
          delay={300}
        />
      </main>
    </div>
  );
};
