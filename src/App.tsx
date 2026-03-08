import { useMemo, useState } from 'react';
import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showField, setShowField] = useState(false);
  const [selectdPerson, setSelectdPerson] = useState<Person | null>(null);
  const timeoutQuery = useMemo(() => debounce(setAppliedQuery, 300), []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    timeoutQuery(e.target.value);
    setSelectdPerson(null);
  };

  const peopleToShow = peopleFromServer.filter(person => {
    const nameLower = person.name.toLowerCase().trim();
    const queryLower = appliedQuery.toLowerCase().trim();

    return nameLower.includes(queryLower);
  });

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectdPerson
            ? `${selectdPerson.name} (${selectdPerson.born} - ${selectdPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={classNames('dropdown', {
            'is-active': showField && peopleToShow.length !== 0,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onFocus={() => setShowField(true)}
              onChange={handleInput}
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {peopleToShow.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => {
                    setSelectdPerson(person);
                    setShowField(false);
                    setQuery(person.name);
                  }}
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {peopleToShow.length === 0 && (
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
  );
};
