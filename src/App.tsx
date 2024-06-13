import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';

export const App: React.FC = () => {
  const [noMatch, setNoMatch] = useState(false);
  const { name, born, died } = peopleFromServer[0];

  const onNoMatch = function (newNoMatch: boolean) {
    setNoMatch(newNoMatch);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${name} (${born} - ${died})`}
        </h1>

        <Dropdown people={peopleFromServer} delay={300} onNoMatch={onNoMatch} />

        {noMatch && (
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
