import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [user, setUser] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {user
            ? `${user.name} (${user.born} - ${user.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete people={peopleFromServer} onSelected={setUser} />
      </main>
    </div>
  );
};
