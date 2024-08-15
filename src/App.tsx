import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import classNames from 'classnames';

export const App: React.FC = () => {
  function debounce(callback: (...args: any[]) => void, delay: number) {
    let timerId: number | null = null;

    return (...args: any[]) => {
      if (timerId) {
        window.clearTimeout(timerId);
      }

      timerId = window.setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }

  const people: Person[] = useMemo(() => [...peopleFromServer], []);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isActive, setIsActive] = useState(false);

  const applyQuery = useCallback(
    debounce((value: string) => setAppliedQuery(value), 300),
    [],
  );

  const filteredList = useMemo(() => {
    return appliedQuery
      ? people.filter(person => person.name.includes(appliedQuery))
      : people;
  }, [appliedQuery, people]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive(true);
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
  };

  return (
    <>
      <div className="container">
        <main className="section is-flex is-flex-direction-column">
          <h1 className="title" data-cy="title">
            {selectedPerson
              ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
              : 'No selected person'}
          </h1>

          <div className="dropdown is-active">
            <div className="dropdown-trigger">
              <input
                type="text"
                placeholder="Enter a part of the name"
                className="input"
                data-cy="search-input"
                value={query}
                onChange={handleQueryChange}
                onFocus={() => {
                  setIsActive(true);
                  if (!query) {
                    setAppliedQuery('');
                  }
                }}
              />
            </div>

            {isActive && filteredList.length > 0 && (
              <div
                className="dropdown-menu"
                role="menu"
                data-cy="suggestions-list"
              >
                <div className="dropdown-content">
                  {filteredList.map(person => (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={person.name}
                      onClick={() => {
                        setSelectedPerson(person);
                        setQuery(person.name);
                        setIsActive(false);
                      }}
                    >
                      <p
                        className={classNames('has-text-link', {
                          'has-text-danger': person.sex === 'f',
                        })}
                      >
                        {person.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {isActive && filteredList.length === 0 && (
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
    </>
  );
};
