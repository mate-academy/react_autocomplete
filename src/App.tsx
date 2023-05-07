/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useMemo } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(peopleFromServer[0]);
  const [isDebouncing, setIsDebouncing] = useState(false);

  let isEntered = false;
  let currentPerson = '';

  if (query.length > 0) {
    isEntered = true;
  } else {
    isEntered = false;
  }

  const foundPerson
   = peopleFromServer.find(people => people.name === selectedPerson.name);

  if (foundPerson !== undefined) {
    currentPerson = foundPerson?.name;
  }

  const visibleMovies: Person[] = useMemo(
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
        {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
      </h1>

      <div className="dropdown is-active">
        {selectedWord.length > 0 && selectedPerson.name === selectedWord
          ? (
            <div className="dropdown-trigger">
              <input
                type="text"
                placeholder="Enter a part of the name"
                className="input"
                value={selectedWord}
                onChange={() => setSelectedWord('')}
              />
            </div>
          )
          : (
            <div className="dropdown-trigger">
              <input
                type="text"
                placeholder="Enter a part of the name"
                className="input"
                onClick={() => setSelectedWord('')}
                onChange={handleInputChange}
              />
            </div>
          )}

        { isEntered === true
        && isDebouncing === false
        && selectedWord.length === 0 && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              <div className="dropdown-item transition__li-item">
                {visibleMovies.map((people) => {
                  if (currentPerson !== people.name) {
                    return (
                      <p
                        className="has-text-link transition__image"
                        onClick={() => {
                          setSelectedPerson(people);
                          setQuery(people.name);
                          setSelectedWord(people.name);
                        }}
                        onKeyDown={() => setQuery(people.name)}
                      >
                        {people.name}
                      </p>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </div>
        )}
        {visibleMovies.length === 0 && isDebouncing === false && (
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
