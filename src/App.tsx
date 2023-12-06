import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PersonDropdown } from './components/PersonDropdown';
import { selectedPeopleBySlug } from './helpers';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState('');

  const selectedPersonBySlug
    = selectedPeopleBySlug(peopleFromServer, selectedPerson);

  const { name, born, died } = selectedPersonBySlug || {};

  return (
    <main className="section">
      {selectedPerson
        ? (
          <h1 className="title">
            {`${name} (${born} = ${died})`}
          </h1>
        ) : (
          <h1 className="title">
            No selected person
          </h1>
        )}
      <PersonDropdown
        onSelect={setSelectedPerson}
        people={peopleFromServer}
        delay={1000}
      />
    </main>
  );
};
