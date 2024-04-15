import React, { useEffect, useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownList } from './components/DropdownList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [person, setPerson] = useState<null | Person>(null);

  const [errorMessage, setErrorMessage] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [hideMenu, setHideMenu] = useState(true);

  const filterPeople = peopleFromServer.filter(people =>
    people.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  useEffect(() => {
    if (filterPeople.length === 0) {
      setErrorMessage(true);
      setHideMenu(false);
    } else {
      setErrorMessage(false);
      setHideMenu(true);
    }
  }, [filterPeople.length]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {!person
            ? 'No selected person'
            : `${person?.name} (${person?.born} - ${person?.died})`}
        </h1>

        <DropdownList
          filterPeople={filterPeople}
          setAppliedQuery={setAppliedQuery}
          setPerson={setPerson}
          hideMenu={hideMenu}
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
