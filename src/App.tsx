import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [people/* setPeople */] = useState(peopleFromServer);

  return (
    <main className="section">
      <h1 className="title">
        Selected Person
      </h1>

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
            {people.map(person => (
              <div className="dropdown-item">
                <p className={`${person.sex === 'm' ? 'has-text-link' : 'has-text-danger'}`}>{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
