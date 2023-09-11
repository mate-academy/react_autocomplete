import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];
  const [visiblePeople, setVisiblePeople] = useState<Person[] | null>(null);

  function findName(event: string) {
    setVisiblePeople(peopleFromServer
      .filter(person => person.name
        .toLowerCase().includes(event.toLowerCase())));
  }

  return (
    <main className="section">
      <h1 className="title">
        {`${name} (${born} = ${died})`}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onClick={() => setVisiblePeople([...peopleFromServer])}
            onChange={(event) => findName(event.target.value)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          {visiblePeople && (
            <div className="dropdown-content">
              {visiblePeople.map(person => (
                <div className="dropdown-item" key={person.slug}>
                  <p className="has-text-link">
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
