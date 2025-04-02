import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  useEffect(() => {
    return () => applyQuery.cancel();
  }, [applyQuery]);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);

    const trimmedQuery = newQuery.trim();

    if (trimmedQuery !== appliedQuery) {
      applyQuery(trimmedQuery);
    }

    setSelectedPerson(null);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!event.relatedTarget) {
      setIsFocused(false);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson?.name
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={classNames('dropdown', {
            'is-active': isFocused,
          })}
          onBlur={handleBlur}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onInput={handleQueryChange}
              data-cy="search-input"
              onFocus={() => setIsFocused(true)}
            />
          </div>

          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
            tabIndex={-1}
          >
            {filteredPeople.length !== 0 && (
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => {
                      setQuery(person.name);
                      setSelectedPerson(person);
                      setIsFocused(false);
                    }}
                  >
                    <p
                      className={classNames('', {
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {filteredPeople.length === 0 && (
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
