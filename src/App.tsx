import React, { useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';

import { useState, useEffect } from "react";

interface PersonType {
  id: number;
  name: string;
  born: number;
  died: number;
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<PersonType | null>(null);
  
  const handleSelected = (person: PersonType | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} 
              (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'
          }
        </h1>

        <div>
          <Autocomplete
            delay={300}
            onSelected={handleSelected}
            people={peopleFromServer}
            placeholder={"Enter a name"}
          />
        </div>
        <div
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
        </div>
      </main>
    </div>
  );
};
