import React, { useState } from 'react';
import './App.scss';
import 'bulma/css/bulma.css';

import { Person } from './types/Person';
import { Autocomplete } from './components';

export const App: React.FC = React.memo(() => {
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedUser
            ? `${selectedUser.name} (${selectedUser.born} - ${selectedUser.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          selectedUser={selectedUser}
          onSelected={e => setSelectedUser(e)}
        />
      </main>
    </div>
  );
});
