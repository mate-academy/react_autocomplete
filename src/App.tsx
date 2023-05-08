/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useMemo } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [born, setBorn] = useState(peopleFromServer[0].born);
  const [died, setDied] = useState(peopleFromServer[0].died);
  const [selectedName, setSelectedName] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(peopleFromServer[0]);
  const [isDebouncing, setIsDebouncing] = useState(false);
  let isEntered = false;
  let currentPerson = peopleFromServer[0].name;

  const foundPerson
   = peopleFromServer.find(people => people.name === selectedPerson.name);

  if (foundPerson !== undefined) {
    currentPerson = foundPerson?.name;
  }

  if (query.length > 0) {
    isEntered = true;
  } else {
    isEntered = false;
  }

  const setEverything = (people: Person) => {
    setSelectedPerson(people);
    setQuery(people.name);
    setSelectedName(people.name);
    setBorn(people.born);
    setDied(people.died);
    peopleFromServer.filter((man) => {
      return man.name !== currentPerson;
    });
  };

  const visiblePeople: Person[] = useMemo(
    () => peopleFromServer.filter((people) => {
      return people.name.toLowerCase().includes(query.toLowerCase().trim());
    }),
    [peopleFromServer, query],
  );

  const debounceOnChange
  = debounce((e: string) => {
    setQuery(e);
    setIsDebouncing(false);
  }, 500);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDebouncing(true);
    debounceOnChange(event.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {`${currentPerson} (${born} - ${died})`}
      </h1>

      <div className="dropdown is-active">
        {selectedName.length > 0 && selectedPerson.name === selectedName
          ? (
            <div className="dropdown-trigger">
              <input
                type="text"
                placeholder="Enter a part of the name"
                className="input"
                value={selectedName}
                onChange={() => setSelectedName('')}
              />
            </div>
          ) : (
            <div className="dropdown-trigger">
              <input
                type="text"
                placeholder="Enter a part of the name"
                className="input"
                onClick={() => setSelectedName('')}
                onChange={handleInputChange}
              />
            </div>
          )}

        { isEntered && !isDebouncing && !selectedName.length && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              <div className="dropdown-item transition__li-item">
                {visiblePeople.map((people) => {
                  return (
                    <p
                      className="has-text-link transition__image"
                      onClick={() => setEverything(people)}
                      onKeyDown={() => setEverything(people)}
                    >
                      {people.name}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {!visiblePeople.length && !isDebouncing && (
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
