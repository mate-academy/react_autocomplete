import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const debounce = (
  f: {
    (value: React.SetStateAction<string>): void,
    (...args: [string]): void,
  }, delay: number | undefined,
) => {
  let timerId: NodeJS.Timeout;

  return (...args: [string]) => {
    clearTimeout(timerId);
    timerId = setTimeout(f, delay, ...args);
  };
};

export const App = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [closeList, setCloseList] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const visiblePeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  function handleSaveSelected(event: React.MouseEvent<HTMLDivElement>) {
    const findPerson = peopleFromServer.find(
      person => person.name === event.currentTarget.textContent,
    ) || peopleFromServer[0];

    setSelectedPerson(findPerson);
    setCloseList(prevState => !prevState);
  }

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setCloseList(false);
  }

  const error = visiblePeople.length === 0;
  const showDropdown = appliedQuery.length > 0;

  return (
    <main className="section">
      <h1 className="title">
        {!selectedPerson && ('No selected person')}
        {selectedPerson && (`${selectedPerson.name} ${selectedPerson.born} = ${selectedPerson.died}`)}
      </h1>

      <div className={classNames(
        'dropdown',
        { 'is-active': !closeList },
      )}
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

        {showDropdown && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {visiblePeople.map(person => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  className="dropdown-item"
                  key={person.name}
                  onClick={handleSaveSelected}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}

              {error && (
                <div className="dropdown-item">
                  <p className="has-text-danger">
                    No matching suggestions
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
