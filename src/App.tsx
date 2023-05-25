/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';

// eslint-disable-next-line max-len
const debounce = (f: { (value: React.SetStateAction<string>): void; (...args: [string]): void; }, delay: number | undefined) => {
  let timerId: NodeJS.Timeout;

  return (...args: [string]) => {
    clearTimeout(timerId);
    timerId = setTimeout(f, delay, ...args);
  };
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(peopleFromServer[0]);
  const { name, born, died } = selectedPerson;
  const [closeList, setCloseList] = useState(false);

  const visiblePeople = useMemo(() => {
    // eslint-disable-next-line no-console
    console.log('Filtering', appliedQuery);

    return peopleFromServer.filter(
      (person) => {
        return person.name.includes(appliedQuery);
      },
    );
  }, [peopleFromServer, appliedQuery]);

  // eslint-disable-next-line max-len
  function handleSaveSelected(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const findPerson = peopleFromServer.find(
      person => person.name === (event.target as HTMLElement).textContent,
    ) || peopleFromServer[0];

    setSelectedPerson(findPerson);
    setCloseList(prevState => !prevState);
  }

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setCloseList(false);
  }

  const error = visiblePeople.length === 0;

  return (
    <main className="section">
      <h1 className="title">
        { `${name} ${born} = ${died}`}
      </h1>

      <div className={
        cn(
          'dropdown',
          { 'is-active': !closeList },
        )
      }
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleInput}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">

            {visiblePeople.map((person) => {
              return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  className="dropdown-item"
                  key={person.name}
                  onClick={(event) => handleSaveSelected(event)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              );
            })}

            {error && (
              <div className="dropdown-item">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
