import React, { useEffect, useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownList } from './components/DropdownList';

export const App: React.FC = () => {
  const [person, setPerson] = useState(peopleFromServer[0]);
  const { name, born, died } = person;

  const [errorMessage, setErrorMessage] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const filterPeople = peopleFromServer.filter(people =>
    people.name.includes(appliedQuery.toLowerCase()),
  );

  useEffect(() => {
    if (filterPeople.length === 0) {
      setErrorMessage(true);
    }
  }, [filterPeople.length]);

  console.log(person);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${name} (${born} - ${died})`}
        </h1>

        <DropdownList
          filterPeople={filterPeople}
          setErrorMessage={setErrorMessage}
          setAppliedQuery={setAppliedQuery}
          setPerson={setPerson}
        />

        {errorMessage && (
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
