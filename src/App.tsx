import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './Autocomplete';

export const App: React.FC = () => {
  const [enteredPerson, setEnteredPerson] = useState<Person | null>(null);
  const [visiblePeople, setVisiblePeople] = useState(peopleFromServer);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {enteredPerson !== null
            ? `${enteredPerson.name} (${enteredPerson.born} - ${enteredPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          setEnteredPerson={setEnteredPerson}
          visiblePeople={visiblePeople}
          setVisiblePeople={setVisiblePeople}
          delay={300}
        />

        {visiblePeople.length === 0 && (
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
        )}
      </main>
    </div>
  );
};
