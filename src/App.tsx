import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropDown } from './DropDown';

const DELAY = 1000;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (
            <>
              {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
              <button
                type="button"
                className="delete is-medium"
                onClick={() => setSelectedPerson(null)}
              >
                .
              </button>
            </>
          )
          : 'No selected person'}
      </h1>

      <DropDown
        people={peopleFromServer}
        onSelect={setSelectedPerson}
        selectedPerson={selectedPerson}
        delay={DELAY}
      />
    </main>
  );
};
