import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
// import { UserList } from './components/UserList/UserList';
import { AutoComplete } from './components/AutoComplete/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const people = peopleFromServer.map((p, i) => ({
    ...p,
    id: i + 1,
  }));

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <AutoComplete
          people={people}
          onSelected={setSelectedPerson}
        />

        {/* <UserList people={peopleFromServer} /> */}

        {/* <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div> */}
      </main>
    </div>
  );
};
