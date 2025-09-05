import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  // eslint-disable-next-line no-console
  console.log('render App');
  const [selectedUser, setSelectedUser] = useState<null | Person>(null);
  const { name, born, died } = selectedUser ?? { name: '', born: '', died: '' };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedUser !== null
            ? `${name} (${born} - ${died})`
            : 'No selected person'}
        </h1>

        <Dropdown users={peopleFromServer} onSelect={setSelectedUser} />
      </main>
    </div>
  );
};
