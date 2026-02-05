import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import Dropdown from './components/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    null,
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          <h1 className="title" data-cy="title">
            {`${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <Dropdown
          people={peopleFromServer}
          onSelected={p => setSelectedPerson(p)}
        />
      </main>
    </div>
  );
};
