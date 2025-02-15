import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { useRef } from 'react';
import { Person } from './types/Person';
import classNames from 'classnames';

type Props = {
  delay: 300;
};

export const App: React.FC<Props> = ({ delay }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [currentPersons] = useState(peopleFromServer);
  const [query, setQuery] = useState('');
  const [normalizedQuery, setNormalizedQuery] = useState('');
  const filteredPersons = currentPersons.filter(person =>
    person.name.toLowerCase().includes(normalizedQuery),
  );
  const [focused, setFocused] = useState(false);

  const timerId = useRef(0);

  function saveQuery(newQuery: string) {
    setQuery(newQuery);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setNormalizedQuery(newQuery.trim().toLowerCase());
    }, delay);
  }

  return (
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
              onChange={event => {
                saveQuery(event.target.value);
                setSelectedPerson(null);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>

          {focused && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPersons.map(person => (
                  <div
                    className={classNames('dropdown-item', {
                      'has-background-info':
                        selectedPerson?.name === person.name,
                    })}
                    data-cy="suggestion-item"
                    key={person.name}
                    onMouseDown={() => {
                      setSelectedPerson(person);
                      setQuery(person.name);
                      setFocused(false);
                    }}
                  >
                    <p className="has-text-danger">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {focused && (
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
            {filteredPersons.length === 0 && (
              <p className="has-text-danger">No matching suggestions</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
