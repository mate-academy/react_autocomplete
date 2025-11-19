import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './Components/Autocomplete';
import { Person } from './types/Person';

// App

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<null | Person>(null);

  const selectedUserHelper = useMemo(() => {
    return (
      <h1 className="title" data-cy="title">
        {selectedUser
          ? `${selectedUser.name} (${selectedUser.born} - ${selectedUser.died})`
          : 'No selected person'}
      </h1>
    );
  }, [selectedUser]);

  // build part

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedUserHelper}
        </h1>

        <div className="dropdown is-active">
          <Autocomplete
            people={peopleFromServer}
            delay={300}
            selectedUser={selectedUser}
            onSelectedUser={setSelectedUser}
          />
        </div>
      </main>
    </div>
  );
};
