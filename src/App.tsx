import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { AutoComplete } from './components/AutoComplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          (() => {
            const { name, born, died } = selectedPerson;

            return (
              <h1 className="title" data-cy="title">
                {`${name} (${born} - ${died})`}
              </h1>
            );
          })()
        ) : (
          <h1 className="title">No selected person</h1>
        )}

        <AutoComplete
          onSelected={setSelectedPerson}
          selectedPerson={selectedPerson}
          people={peopleFromServer}
        />
      </main>
    </div>
  );
};
