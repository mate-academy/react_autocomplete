import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const noUser = {
    name: 'No selected person',
    born: null,
    died: null,
  };

  const [people, setPeople] = useState(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || noUser;
  const [query, setQuery] = useState('');
  const [timedQuery, setTimedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isBlockFocused, setIsBlockFocused] = useState(false);

  const timeOutQuery = useCallback(debounce(setTimedQuery, 1000), []);

  const onChangeHandle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      timeOutQuery(event.target.value);
      setSelectedPerson(null);
    },
    [timeOutQuery],
  );

  useMemo(() => {
    const sortedPeople = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(timedQuery.toLowerCase().trim()),
    );

    setPeople(sortedPeople);
  }, [timedQuery]);

  useEffect(() => {
    if (people.length === 0) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [people.length, timedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {born === null && died === null
            ? `${name}`
            : `${name} (${born} - ${died})`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
              }}
              onChange={onChangeHandle}
              value={query}
            />
          </div>

          <div
            className={classNames('dropdown-menu', {
              'display-none': (!isFocused || isError) && !isBlockFocused,
            })}
            role="menu"
            data-cy="suggestions-list"
          >
            <div
              className="dropdown-content"
              onMouseEnter={() => setIsBlockFocused(true)}
              onMouseLeave={() => setIsBlockFocused(false)}
            >
              {people.map(person => (
                <div
                  style={{ cursor: 'pointer' }}
                  key={`${person.name}-${Math.round(Math.random() * 100) / 100}`}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => {
                    setSelectedPerson(person);
                    setQuery(person.name);
                    setTimedQuery(person.name);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}

              {/* <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Elisabeth Hercke</p>
              </div> */}
            </div>
          </div>
        </div>

        <div
          className={classNames(
            'notification is-danger is-light mt-3 is-align-self-flex-start',
            { 'display-none': !isError },
          )}
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      </main>
    </div>
  );
};
