import React, { useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './Autocomplete';

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // const selectedName = (person: Person) => {
  //   setSelectedPerson(
  //     currentpeople => currentpeople.find(
  //       (user: Person) => user.slug === person?.slug,
  //     ),
  //   );
  // };

  // const delay = 1000;

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (
            `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          )
          : (
            'No person selected'
          )}
      </h1>

      <Autocomplete
        people={peopleFromServer}
        onSelect={setSelectedPerson}

        // delay={delay}
      />

    </main>
  );
};

/*
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <div className="dropdown-item">
              <p className="has-text-link">Pieter Haverbeke</p>
            </div>

            <div className="dropdown-item">
              <p className="has-text-link">Pieter Bernard Haverbeke</p>
            </div>

            <div className="dropdown-item">
              <p className="has-text-link">Pieter Antone Haverbeke</p>
            </div>

            <div className="dropdown-item">
              <p className="has-text-danger">Elisabeth Haverbeke</p>
            </div>

            <div className="dropdown-item">
              <p className="has-text-link">Pieter de Decker</p>
            </div>

            <div className="dropdown-item">
              <p className="has-text-danger">Petronella de Decker</p>
            </div>

            <div className="dropdown-item">
              <p className="has-text-danger">Elisabeth Hercke</p>
            </div>
          </div>
        </div>
      </div>
*/
