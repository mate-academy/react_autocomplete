/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useMemo } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [currentValue, setCurrentValue] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(peopleFromServer[0]);
  const [animationTime, setAnimationTime] = useState(1);
  let isEntered = false;

  if (query.length > 0 && currentValue === false) {
    isEntered = true;
  } else {
    isEntered = false;
  }

  const visibleMovies: Person[] = useMemo(
    () => peopleFromServer.filter((people) => {
      return people.name.toLowerCase().includes(query.toLowerCase().trim());
    }),
    [peopleFromServer, query],
  );

  return (
    <main className="section">
      <h1 className="title">
        {`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
          />
          <input
            className="Animation-Duration-setter"
            type="number"
            onChange={(event) => {
              setAnimationTime(+event.target.value);
            }}
          />
        </div>

        { isEntered === true && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              <div className="dropdown-item transition__li-item">
                {visibleMovies.map((people) => {
                  return (
                    <p
                      className="has-text-link transition__image"
                      style={{ animationDuration: `${animationTime}s` }}
                      onClick={() => {
                        setQuery(people.name);
                        setCurrentValue(true);
                        setSelectedPerson(people);
                      }}
                      onKeyDown={() => setQuery(people.name)}
                    >
                      {people.name}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {visibleMovies.length === 0 && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              <div className="dropdown-item transition__li-item">
                <p className="has-text-link transition__image">
                  No matching suggestions
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};
